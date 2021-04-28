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

func (ac *AuthController) loginWithRememberMeToken(c *gin.Context, token string) (string, error) {
	userID, err := ac.rs.GetUserIDByID(token)
	if err != nil {
		return "", err
	}

	rememberMeTokenID, rememberMeToken, err := GenerateRememberMeToken()
	if err != nil {
		return "", model.ErrFailedTokenCreation
	}
	if err := ac.rs.CreateOrUpdate(userID, rememberMeTokenID, config.TimeFunc().Add(config.TimeoutRememberMeToken())); err != nil {
		return "", err
	}

	c.Set(config.IdentityKeyRememberMeToken(), rememberMeToken)
	c.SetCookie(config.CookieNameRememberMeToken(), rememberMeToken, config.MaxAgeRememberMeToken(), "/", "", false, true)

	return userID, nil
}

func (ac *AuthController) loginWithID(c *gin.Context, a *model.Auth) (string, error) {
	if err := ac.ss.Login(a); err != nil {
		if !errors.Is(err, model.ErrInvalidPassword) {
			err = model.ErrFailedLogin
		}
		return "", err
	}

	if a.RememberMe {
		rememberMeTokenID, rememberMeToken, err := GenerateRememberMeToken()
		if err != nil {
			return "", model.ErrFailedTokenCreation
		}
		if err := ac.rs.CreateOrUpdate(a.ID, rememberMeTokenID, config.TimeFunc().Add(config.TimeoutRememberMeToken())); err != nil {
			return "", err
		}

		c.Set(config.IdentityKeyRememberMeToken(), rememberMeToken)
		c.SetCookie(config.CookieNameRememberMeToken(), rememberMeToken, config.MaxAgeRememberMeToken(), "/", "", false, true)
	}

	return a.ID, nil
}

func (ac *AuthController) LoginHandler(c *gin.Context) {
	var userID string

	jwtToken, err := jwtFromCookie(c, config.CookieNameRememberMeToken())
	if err == nil {
		// RememberMeToken を検証する。
		token, err := ParseStringToken(jwtToken, config.SecretKeyRememberMeToken())
		if err != nil {
			unauthorized(c, http.StatusBadRequest, err)
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		tokenID := claims[config.IdentityKeyRememberMeToken()].(string)
		id, err := ac.loginWithRememberMeToken(c, tokenID)
		if err != nil {
			unauthorized(c, http.StatusBadRequest, err)
			return
		}
		userID = id
	} else {
		// user_id と password を検証する。
		var a model.Auth
		if err := c.ShouldBindJSON(&a); err != nil {
			unauthorized(c, http.StatusBadRequest, model.ErrInvalidParameter)
			return
		}
		id, err := ac.loginWithID(c, &a)
		if err != nil {
			unauthorized(c, http.StatusBadRequest, err)
			return
		}
		userID = id
	}

	// access token を生成する。
	accessTokenID, accessToken, err := GenerateAccessToken()
	if err != nil {
		unauthorized(c, http.StatusUnauthorized, model.ErrFailedTokenCreation)
		return
	}
	if err := ac.ss.CreateOrUpdate(userID, accessTokenID, config.TimeFunc().Add(config.TimeoutAccessToken())); err != nil {
		unauthorized(c, http.StatusUnauthorized, err)
		return
	}

	c.Header("Authorization", config.TokenHeadName()+" "+accessToken)

	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
	})
}

func unauthorized(c *gin.Context, code int, err error) {
	c.Header("WWW-Authenticate", "JWT realm="+config.Realm())
	errResponse(c, code, err)
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
	id := uuid.New().String()
	data := jwt.MapClaims{}
	data[config.IdentityKeyAccessToken()] = id

	token, err := GenerateToken(data, config.SecretKeyAccessToken(), config.TimeoutAccessToken())
	if err != nil {
		return "", "", err
	}

	return id, token, nil
}

func GenerateRememberMeToken() (string, string, error) {
	id := uuid.New().String()
	data := jwt.MapClaims{}
	data[config.IdentityKeyRememberMeToken()] = id

	token, err := GenerateToken(data, config.SecretKeyRememberMeToken(), config.TimeoutRememberMeToken())
	if err != nil {
		return "", "", err
	}

	return id, token, nil
}

func jwtFromHeader(c *gin.Context, key string) (string, error) {
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

func jwtFromCookie(c *gin.Context, key string) (string, error) {
	cookie, _ := c.Cookie(key)

	if cookie == "" {
		return "", model.ErrEmptyCookieToken
	}

	return cookie, nil
}

func ParseAccessTokenFromContext(c *gin.Context) (*jwt.Token, error) {
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

func ParseRememberMeTokenFromContext(c *gin.Context) (*jwt.Token, error) {
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
		errResponse(c, http.StatusBadRequest, err)
		return
	}

	rememberMeToken, err := ParseRememberMeTokenFromContext(c)
	if err != nil {
		errResponse(c, http.StatusBadRequest, err)
		return
	}

	accessTokenClaims := accessToken.Claims.(jwt.MapClaims)
	rememberMeTokenClaims := rememberMeToken.Claims.(jwt.MapClaims)

	accessTokenID := accessTokenClaims[config.IdentityKeyAccessToken()].(string)
	rememberMeTokenID := rememberMeTokenClaims[config.IdentityKeyRememberMeToken()].(string)

	s := service.NewAuthService()
	if err := s.Delete(accessTokenID, rememberMeTokenID); err != nil {
		errResponse(c, http.StatusBadRequest, err)
		return
	}

	code := http.StatusOK
	c.JSON(code, gin.H{
		"code": code,
	})
}

func errResponse(c *gin.Context, code int, err error) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": err.Error(),
	})
}
