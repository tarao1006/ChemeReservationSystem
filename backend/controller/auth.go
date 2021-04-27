package controller

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type AuthController struct{}

func NewAuthController() *AuthController {
	return &AuthController{}
}

func (AuthController) LoginHandler(c *gin.Context) {
	ss := service.NewSessionService()
	rs := service.NewRememberMeSessionService()

	// user_id と password を検証する。
	var a model.Auth
	if err := c.ShouldBindJSON(&a); err != nil {
		unauthorized(c, http.StatusBadRequest, model.ErrInvalidParameter)
		return
	}
	if err := ss.Login(&a); err != nil {
		if !errors.Is(err, model.ErrInvalidPassword) {
			err = model.ErrFailedLogin
		}
		unauthorized(c, http.StatusUnauthorized, err)
		return
	}

	// access token を生成する。
	accessTokenID, accessToken, accessTokenExpire, err := GenerateAccessToken()
	if err != nil {
		unauthorized(c, http.StatusUnauthorized, model.ErrFailedTokenCreation)
		return
	}
	if err := ss.CreateOrUpdate(a.ID, accessTokenID, accessTokenExpire); err != nil {
		unauthorized(c, http.StatusUnauthorized, err)
		return
	}

	if a.RememberMe {
		rememberMeTokenID, rememberMeToken, rememberMeTokenExpire, err := GenerateRememberMeToken()
		if err != nil {
			unauthorized(c, http.StatusUnauthorized, model.ErrFailedTokenCreation)
			return
		}
		if err := rs.CreateOrUpdate(a.ID, rememberMeTokenID, rememberMeTokenExpire); err != nil {
			unauthorized(c, http.StatusUnauthorized, err)
			return
		}

		expireCookie := time.Now().Add(config.TimeoutRememberMeToken())
		maxage := int(expireCookie.Unix() - time.Now().Unix())
		c.Set(config.IdentityKeyRememberMeToken(), rememberMeToken)
		c.SetCookie(config.CookieNameRememberMeToken(), rememberMeToken, maxage, "/", "", false, true)
	}

	c.JSON(http.StatusOK, gin.H{
		"code":   http.StatusOK,
		"token":  accessToken,
		"expire": accessTokenExpire.Format(time.RFC3339),
	})
}

func unauthorized(c *gin.Context, code int, err error) {
	c.Header("WWW-Authenticate", "JWT realm="+config.Realm())
	response(c, code, err)
}

func GenerateToken(data jwt.MapClaims, secretKey []byte, timeout time.Duration) (string, time.Time, error) {
	token := jwt.New(jwt.GetSigningMethod(config.SigningAlgorithm()))
	claims := token.Claims.(jwt.MapClaims)

	for key, value := range data {
		claims[key] = value
	}

	expire := time.Now().UTC().Add(timeout)
	claims["exp"] = expire.Unix()
	claims["orig_iat"] = time.Now().Unix()
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expire, nil
}

func GenerateAccessToken() (string, string, time.Time, error) {
	id := uuid.New().String()
	data := jwt.MapClaims{}
	data[config.IdentityKeyAccessToken()] = id

	token, expire, err := GenerateToken(data, config.SecretKeyAccessToken(), config.TimeoutAccessToken())
	if err != nil {
		return "", "", time.Time{}, err
	}

	return id, token, expire, nil
}

func GenerateRememberMeToken() (string, string, time.Time, error) {
	id := uuid.New().String()
	data := jwt.MapClaims{}
	data[config.IdentityKeyRememberMeToken()] = id

	token, expire, err := GenerateToken(data, config.SecretKeyRememberMeToken(), config.TimeoutRememberMeToken())
	if err != nil {
		return "", "", time.Time{}, err
	}

	return id, token, expire, nil
}

func jwtFromHeader(c *gin.Context, key string) (string, error) {
	authHeader := c.Request.Header.Get(key)

	if authHeader == "" {
		return "", model.ErrEmptyAuthHeader
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if !(len(parts) == 2 && parts[0] == "Bearer") {
		return "", model.ErrInvalidAuthHeader
	}

	return parts[1], nil
}

func jwtFromCookie(c *gin.Context, key string) (string, error) {
	cookie, _ := c.Cookie(key)

	if cookie == "" {
		return "", model.ErrEmptyCookieToken
	}

	return cookie, nil
}

func ParseAccessToken(c *gin.Context) (*jwt.Token, error) {
	token, err := jwtFromHeader(c, "Authorization")
	if err != nil {
		return nil, err
	}

	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(config.SigningAlgorithm()) != t.Method {
			return nil, model.ErrInvalidSigningAlgorithm
		}
		c.Set("ACCESS_TOKEN", token)
		return config.SecretKeyAccessToken(), nil
	})
}

func ParseRememberMeToken(c *gin.Context) (*jwt.Token, error) {
	token, err := jwtFromCookie(c, config.CookieNameRememberMeToken())
	if err != nil {
		return nil, err
	}

	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(config.SigningAlgorithm()) != t.Method {
			return nil, model.ErrInvalidSigningAlgorithm
		}
		c.Set("REMEMBER_ME_TOKEN", token)
		return config.SecretKeyRememberMeToken(), nil
	})
}

func (AuthController) LogoutHandler(c *gin.Context) {
	accessToken, err := ParseAccessToken(c)
	if err != nil {
		response(c, http.StatusBadRequest, err)
		return
	}

	rememberMeToken, err := ParseRememberMeToken(c)
	if err != nil {
		response(c, http.StatusBadRequest, err)
		return
	}

	accessTokenClaims := accessToken.Claims.(jwt.MapClaims)
	rememberMeTokenClaims := rememberMeToken.Claims.(jwt.MapClaims)

	accessTokenID := accessTokenClaims[config.IdentityKeyAccessToken()].(string)
	rememberMeTokenID := rememberMeTokenClaims[config.IdentityKeyRememberMeToken()].(string)

	s := service.NewAuthService()
	if err := s.Delete(accessTokenID, rememberMeTokenID); err != nil {
		response(c, http.StatusBadRequest, err)
		return
	}

	code := http.StatusOK
	c.JSON(code, gin.H{
		"code": code,
	})
}

func (AuthController) RefreshHandler(c *gin.Context) {
}

func response(c *gin.Context, code int, err error) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": err.Error(),
	})
}
