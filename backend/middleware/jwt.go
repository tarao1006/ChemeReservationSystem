package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tarao1006/ChemeReservationSystem/auth"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

var (
	ErrForbidden               = errors.New("you don't have permission to access this resource")
	ErrMissingLoginValues      = errors.New("missing Username or Password")
	ErrFailedAuthentication    = errors.New("incorrect Username or Password")
	ErrFailedTokenCreation     = errors.New("failed to create JWT Token")
	ErrExpiredToken            = errors.New("token is expired")
	ErrEmptyAuthHeader         = errors.New("auth header is empty")
	ErrMissingExpField         = errors.New("missing exp field")
	ErrWrongFormatOfExp        = errors.New("exp must be float64 format")
	ErrInvalidAuthHeader       = errors.New("auth header is invalid")
	ErrInvalidSigningAlgorithm = errors.New("invalid signing algorithm")
)

type JWTMiddleware struct {
	Realm                      string
	SigningAlgorithm           string
	SecretKeyAccessToken       []byte
	SecretKeyRememberMeToken   []byte
	IdentityKeyAccessToken     string
	IdentityKeyRememberMeToken string
	TimeoutAccessToken         time.Duration
	TimeoutRememberMeToken     time.Duration
	MaxRefreshAccessToken      time.Duration
	MaxRefreshRememberMeToken  time.Duration
	TokenLookup                string
	TokenHeadName              string
	TimeFunc                   func() time.Time
	Authenticator              func(a *auth.Auth) error
	Unauthorized               func(*gin.Context, int, string)
	IdentityHandler            func(*gin.Context) interface{}
	LoginResponse              func(*gin.Context, int, string, time.Time)
	LogoutResponse             func(*gin.Context, int)
	RefreshResponse            func(*gin.Context, int, string, time.Time)
	HTTPStatusMessageFunc      func(e error, c *gin.Context) string
}

func DefaultJWTMiddleware() (*JWTMiddleware, error) {
	mw := &JWTMiddleware{
		Realm:                      config.Realm(),
		SigningAlgorithm:           config.SigningAlgorithm(),
		SecretKeyAccessToken:       config.SecretKeyAccessToken(),
		SecretKeyRememberMeToken:   config.SecretKeyRememberMeToken(),
		IdentityKeyAccessToken:     config.IdentityKeyAccessToken(),
		IdentityKeyRememberMeToken: config.IdentityKeyRememberMeToken(),
		TimeoutAccessToken:         config.TimeoutAccessToken(),
		TimeoutRememberMeToken:     config.TimeoutRememberMeToken(),
		MaxRefreshAccessToken:      config.MaxRefreshAccessToken(),
		MaxRefreshRememberMeToken:  config.MaxRefreshRememberMeToken(),
		TokenLookup:                config.TokenLookup(),
		TokenHeadName:              config.TokenHeadName(),
		TimeFunc:                   time.Now,
	}
	return NewJWTMiddleware(mw)
}

func NewJWTMiddleware(mw *JWTMiddleware) (*JWTMiddleware, error) {
	if err := mw.Init(); err != nil {
		return nil, err
	}

	return mw, nil
}

func (mw *JWTMiddleware) Init() error {
	if mw.Unauthorized == nil {
		mw.Unauthorized = func(c *gin.Context, code int, message string) {
			c.Header("WWW-Authenticate", "JWT realm="+mw.Realm)
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		}
	}

	if mw.IdentityHandler == nil {
		mw.IdentityHandler = func(c *gin.Context) interface{} {
			claims := ExtractClaims(c)
			return claims[mw.IdentityKeyAccessToken]
		}
	}

	if mw.LoginResponse == nil {
		mw.LoginResponse = loginResponse
	}

	if mw.LogoutResponse == nil {
		mw.LogoutResponse = logoutResponse
	}

	if mw.RefreshResponse == nil {
		mw.RefreshResponse = refreshResponse
	}

	if mw.HTTPStatusMessageFunc == nil {
		mw.HTTPStatusMessageFunc = httpStatusMessageFunc
	}

	return nil
}

func (mw *JWTMiddleware) LoginHandler(c *gin.Context) {
	var a auth.Auth
	if err := c.BindJSON(&a); err != nil {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(err, c))
		return
	}

	// user_id と password を検証する。
	s := service.NewAuthService()
	if err := s.Login(&a); err != nil {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(model.ErrInvalidPassword, c))
		return
	}

	// TODO: DB に書き込む。
	accessTokenID := uuid.New().String()

	accessToken := jwt.New(jwt.GetSigningMethod(mw.SigningAlgorithm))
	accessTokenclaims := accessToken.Claims.(jwt.MapClaims)
	accessTokenclaims[mw.IdentityKeyAccessToken] = accessTokenID
	accessTokenExpire := mw.TimeFunc().Add(mw.TimeoutAccessToken)
	accessTokenclaims["exp"] = accessTokenExpire.Unix()
	accessTokenclaims["orig_iat"] = mw.TimeFunc().Unix()
	accessTokenString, err := accessToken.SignedString(mw.SecretKeyAccessToken)
	if err != nil {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(ErrFailedTokenCreation, c))
		return
	}

	if a.RememberMe {
		// TODO: DB に書き込む。
		rememberMeTokenID := uuid.New().String()

		rememberMeToken := jwt.New(jwt.GetSigningMethod(mw.SigningAlgorithm))
		rememberMeTokenclaims := rememberMeToken.Claims.(jwt.MapClaims)
		rememberMeTokenclaims[mw.IdentityKeyRememberMeToken] = rememberMeTokenID
		rememberMeTokenExpire := mw.TimeFunc().Add(mw.TimeoutRememberMeToken)
		rememberMeTokenclaims["exp"] = rememberMeTokenExpire.Unix()
		rememberMeTokenclaims["orig_iat"] = mw.TimeFunc().Unix()
		rememberMeTokenString, err := accessToken.SignedString(mw.SecretKeyRememberMeToken)
		if err != nil {
			mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(ErrFailedTokenCreation, c))
			return
		}
		fmt.Println(rememberMeTokenString)
		// TODO: Cookie にセットする。
	}

	mw.LoginResponse(c, http.StatusOK, accessTokenString, accessTokenExpire)
}

func (mw *JWTMiddleware) LogoutHandler(c *gin.Context) {
	mw.LogoutResponse(c, http.StatusOK)
}

func (mw *JWTMiddleware) RefreshHandler(c *gin.Context) {
	tokenString, expire, err := mw.refreshToken(c)
	if err != nil {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(err, c))
		return
	}

	mw.RefreshResponse(c, http.StatusOK, tokenString, expire)
}

func (mw *JWTMiddleware) MiddlewareFunc() gin.HandlerFunc {
	return func(c *gin.Context) {
		mw.middlewareImpl(c)
	}
}

func (mw *JWTMiddleware) middlewareImpl(c *gin.Context) {
	tokenString, err := mw.jwtFromHeader(c, mw.TokenLookup)
	if err != nil {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(err, c))
		return
	}

	token, err := mw.parseTokenString(tokenString)
	if err != nil {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(err, c))
		return
	}
	c.Header("Authorization", mw.TokenHeadName+" "+tokenString)

	claims := token.Claims.(jwt.MapClaims)

	if claims["exp"] == nil {
		mw.Unauthorized(c, http.StatusBadRequest, mw.HTTPStatusMessageFunc(ErrMissingExpField, c))
		return
	}

	if _, ok := claims["exp"].(float64); !ok {
		mw.Unauthorized(c, http.StatusBadRequest, mw.HTTPStatusMessageFunc(ErrWrongFormatOfExp, c))
		return
	}

	if int64(claims["exp"].(float64)) < mw.TimeFunc().Unix() {
		mw.Unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(ErrExpiredToken, c))
		return
	}

	c.Set("JWT_PAYLOAD", claims)
	identity := mw.IdentityHandler(c)

	if identity != nil {
		c.Set(mw.IdentityKeyAccessToken, identity)
	}

	c.Next()
}

func (mw *JWTMiddleware) refreshToken(c *gin.Context) (string, time.Time, error) {
	claims, err := mw.checkIfTokenExpire(c)
	if err != nil {
		return "", time.Now(), err
	}

	newToken := jwt.New(jwt.GetSigningMethod(mw.SigningAlgorithm))
	newClaims := newToken.Claims.(jwt.MapClaims)
	for key := range claims {
		newClaims[key] = claims[key]
	}

	expire := mw.TimeFunc().Add(mw.TimeoutAccessToken)
	newClaims["exp"] = expire.Unix()
	newClaims["orig_iat"] = mw.TimeFunc().Unix()
	tokenString, err := newToken.SignedString(mw.SecretKeyAccessToken)

	if err != nil {
		return "", time.Now(), err
	}

	return tokenString, expire, nil
}

func loginResponse(c *gin.Context, code int, token string, expire time.Time) {
	c.JSON(http.StatusOK, gin.H{
		"code":   http.StatusOK,
		"token":  token,
		"expire": expire.Format(time.RFC3339),
	})
}

func logoutResponse(c *gin.Context, code int) {
	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
	})
}

func httpStatusMessageFunc(e error, c *gin.Context) string {
	return e.Error()
}

func refreshResponse(c *gin.Context, code int, token string, expire time.Time) {
	c.JSON(http.StatusOK, gin.H{
		"code":   http.StatusOK,
		"token":  token,
		"expire": expire.Format(time.RFC3339),
	})
}

func (mw *JWTMiddleware) jwtFromHeader(c *gin.Context, key string) (string, error) {
	authHeader := c.Request.Header.Get(key)

	if authHeader == "" {
		return "", ErrEmptyAuthHeader
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if !(len(parts) == 2 && parts[0] == mw.TokenHeadName) {
		return "", ErrInvalidAuthHeader
	}

	return parts[1], nil
}

func (mw *JWTMiddleware) parseTokenString(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(mw.SigningAlgorithm) != t.Method {
			return nil, ErrInvalidSigningAlgorithm
		}
		return mw.SecretKeyAccessToken, nil
	})
}

func (mw *JWTMiddleware) checkIfTokenExpire(c *gin.Context) (jwt.MapClaims, error) {
	tokenString, err := mw.jwtFromHeader(c, mw.TokenLookup)
	if err != nil {
		return nil, err
	}

	token, err := mw.parseTokenString(tokenString)
	if err != nil {
		validationErr, ok := err.(*jwt.ValidationError)
		if !ok || validationErr.Errors != jwt.ValidationErrorExpired {
			return nil, err
		}
	}

	claims := token.Claims.(jwt.MapClaims)

	origIat := int64(claims["orig_iat"].(float64))
	if origIat < mw.TimeFunc().Add(-mw.MaxRefreshAccessToken).Unix() {
		return nil, ErrExpiredToken
	}

	return claims, nil
}

// ExtractClaims help to extract the JWT claims
func ExtractClaims(c *gin.Context) jwt.MapClaims {
	claims, exists := c.Get("JWT_PAYLOAD")
	if !exists {
		return make(jwt.MapClaims)
	}

	return claims.(jwt.MapClaims)
}
