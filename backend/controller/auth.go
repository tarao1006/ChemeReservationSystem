package controller

import (
	"errors"
	"net/http"
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

	c.JSON(http.StatusOK, gin.H{
		"code":   http.StatusOK,
		"token":  accessToken,
		"expire": accessTokenExpire.Format(time.RFC3339),
	})

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
}

func unauthorized(c *gin.Context, code int, err error) {
	c.Header("WWW-Authenticate", "JWT realm="+config.Realm())
	c.JSON(code, gin.H{
		"code":    code,
		"message": err.Error(),
	})
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

func (AuthController) LogoutHandler(c *gin.Context) {
}

func (AuthController) RefreshHandler(c *gin.Context) {
}
