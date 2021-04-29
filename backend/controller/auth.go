package controller

import (
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type AuthController struct {
	ss *service.SessionService
	rs *service.RememberMeSessionService
}

func NewAuthController() *AuthController {
	return &AuthController{
		ss: service.NewSessionService(),
		rs: service.NewRememberMeSessionService(),
	}
}

func (ac *AuthController) LoginWithRememberMeToken(c *gin.Context, token string) (string, error) {
	session, err := ac.rs.GetByID(token)
	if err != nil {
		return "", err
	}

	if session.IsExpired() {
		return "", model.ErrExpiredToken
	}

	rememberMeTokenID, rememberMeToken, err := GenerateRememberMeToken()
	if err != nil {
		return "", model.ErrFailedTokenCreation
	}
	if err := ac.rs.CreateOrUpdate(session.UserID, rememberMeTokenID, config.TimeFunc().Add(config.TimeoutRememberMeToken())); err != nil {
		return "", model.ErrFailedTokenCreation
	}

	c.SetCookie(config.CookieNameRememberMeToken(), rememberMeToken, config.MaxAgeRememberMeToken(), "/", "", false, true)

	return session.UserID, nil
}

func (ac *AuthController) LoginWithID(c *gin.Context, a *model.Auth) (string, error) {
	if err := ac.ss.Login(a); err != nil {
		return "", err
	}

	if a.RememberMe {
		rememberMeTokenID, rememberMeToken, err := GenerateRememberMeToken()
		if err != nil {
			return "", model.ErrFailedTokenCreation
		}
		if err := ac.rs.CreateOrUpdate(a.ID, rememberMeTokenID, config.TimeFunc().Add(config.TimeoutRememberMeToken())); err != nil {
			return "", model.ErrFailedTokenCreation
		}

		c.Set(config.IdentityKeyRememberMeToken(), rememberMeToken)
		c.SetCookie(config.CookieNameRememberMeToken(), rememberMeToken, config.MaxAgeRememberMeToken(), "/", "", false, true)
	}

	return a.ID, nil
}

func SetAccessToken(c *gin.Context, token string) {
	c.SetCookie(config.CookieNameAccessToken(), token, config.MaxAgeAccessToken(), "/", "", false, true)
}

func UnsetAccessToken(c *gin.Context) {
	c.SetCookie(config.CookieNameAccessToken(), "", -1, "/", "", false, true)
}

func SetRememberMeToken(c *gin.Context, token string) {
	c.SetCookie(config.CookieNameRememberMeToken(), token, config.MaxAgeRememberMeToken(), "/", "", false, true)
}

func UnsetRememberMeToken(c *gin.Context) {
	c.SetCookie(config.CookieNameRememberMeToken(), "", -1, "/", "", false, true)
}

func (ac *AuthController) LoginHandler(c *gin.Context) {
	var userID string

	var a model.Auth
	errParam := c.ShouldBindJSON(&a)
	jwtToken, errToken := JWTFromCookie(c, config.CookieNameRememberMeToken())

	// パラメータとトークンがともに存在しない場合
	if errParam != nil && errToken != nil {
		Unauthorized(c, http.StatusBadRequest, model.ErrInvalidParameter)
		return
	}

	if errParam == nil { // パラメータが存在する場合
		id, err := ac.LoginWithID(c, &a)
		if err != nil {
			Unauthorized(c, http.StatusBadRequest, err)
			return
		}
		userID = id
	} else { // トークンが存在する場合
		token, err := ParseStringToken(jwtToken, config.SecretKeyRememberMeToken())
		if err != nil {
			Unauthorized(c, http.StatusBadRequest, err)
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		tokenID := claims[config.IdentityKeyRememberMeToken()].(string)
		id, err := ac.LoginWithRememberMeToken(c, tokenID)
		if err != nil {
			Unauthorized(c, http.StatusBadRequest, err)
			return
		}
		userID = id
	}

	// access token を生成する。
	accessTokenID, accessToken, err := GenerateAccessToken()
	if err != nil {
		Unauthorized(c, http.StatusUnauthorized, model.ErrFailedTokenCreation)
		return
	}
	if err := ac.ss.CreateOrUpdate(userID, accessTokenID, config.TimeFunc().Add(config.TimeoutAccessToken())); err != nil {
		Unauthorized(c, http.StatusUnauthorized, err)
		return
	}

	SetAccessToken(c, accessToken)

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "ok",
	})
}

func Unauthorized(c *gin.Context, code int, err error) {
	c.Header("WWW-Authenticate", "JWT realm="+config.Realm())
	ErrResponse(c, code, err)
}

func GenerateToken(data jwt.MapClaims, secretKey []byte, timeout time.Duration) (string, error) {
	token := jwt.New(jwt.GetSigningMethod(config.SigningAlgorithm()))
	claims := token.Claims.(jwt.MapClaims)

	for key, value := range data {
		claims[key] = value
	}

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func GenerateAccessToken() (string, string, error) {
	id := config.UUID()
	data := jwt.MapClaims{}
	data[config.IdentityKeyAccessToken()] = id

	token, err := GenerateToken(data, config.SecretKeyAccessToken(), config.TimeoutAccessToken())
	if err != nil {
		return "", "", err
	}

	return id, token, nil
}

func GenerateRememberMeToken() (string, string, error) {
	id := config.UUID()
	data := jwt.MapClaims{}
	data[config.IdentityKeyRememberMeToken()] = id

	token, err := GenerateToken(data, config.SecretKeyRememberMeToken(), config.TimeoutRememberMeToken())
	if err != nil {
		return "", "", err
	}

	return id, token, nil
}

func JWTFromHeader(c *gin.Context, key string) (string, error) {
	authHeader := c.Request.Header.Get(key)

	if authHeader == "" {
		return "", model.ErrEmptyAuthHeader
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if !(len(parts) == 2 && parts[0] == config.TokenHeadName()) {
		return "", model.ErrInvalidAuthHeader
	}

	return parts[1], nil
}

func JWTFromCookie(c *gin.Context, key string) (string, error) {
	cookie, _ := c.Cookie(key)

	if cookie == "" {
		return "", model.ErrEmptyCookieToken
	}

	return cookie, nil
}

func ParseAccessTokenFromContext(c *gin.Context) (*jwt.Token, error) {
	token, err := JWTFromCookie(c, config.CookieNameAccessToken())
	if err != nil {
		return nil, err
	}

	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(config.SigningAlgorithm()) != t.Method {
			return nil, model.ErrInvalidSigningAlgorithm
		}
		return config.SecretKeyAccessToken(), nil
	})
}

func ParseRememberMeTokenFromContext(c *gin.Context) (*jwt.Token, error) {
	token, err := JWTFromCookie(c, config.CookieNameRememberMeToken())
	if err != nil {
		return nil, err
	}

	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(config.SigningAlgorithm()) != t.Method {
			return nil, model.ErrInvalidSigningAlgorithm
		}
		return config.SecretKeyRememberMeToken(), nil
	})
}

func ParseStringToken(token string, key []byte) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(config.SigningAlgorithm()) != t.Method {
			return nil, model.ErrInvalidSigningAlgorithm
		}
		return key, nil
	})
}

func (AuthController) LogoutHandler(c *gin.Context) {
	accessToken, err := ParseAccessTokenFromContext(c)
	if err != nil {
		ErrResponse(c, http.StatusBadRequest, err)
		return
	}
	accessTokenClaims := accessToken.Claims.(jwt.MapClaims)
	accessTokenID := accessTokenClaims[config.IdentityKeyAccessToken()].(string)

	ss := service.NewSessionService()
	if err := ss.DeleteByID(accessTokenID); err != nil {
		ErrResponse(c, http.StatusBadRequest, err)
		return
	}

	UnsetAccessToken(c)

	rememberMeToken, err := ParseRememberMeTokenFromContext(c)
	if err == nil {
		rememberMeTokenClaims := rememberMeToken.Claims.(jwt.MapClaims)
		rememberMeTokenID := rememberMeTokenClaims[config.IdentityKeyRememberMeToken()].(string)

		rs := service.NewRememberMeSessionService()
		if err := rs.DeleteByID(rememberMeTokenID); err != nil {
			ErrResponse(c, http.StatusBadRequest, err)
			return
		}

		UnsetRememberMeToken(c)
	}

	code := http.StatusOK
	c.JSON(code, gin.H{
		"code": code,
	})
}

func ErrResponse(c *gin.Context, code int, err error) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": err.Error(),
	})
}
