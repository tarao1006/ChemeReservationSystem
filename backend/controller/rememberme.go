package controller

import (
	"net/http"
	"time"

	ginjwt "github.com/appleboy/gin-jwt/v2"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tarao1006/ChemeReservationSystem/auth"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

func jwtFromCookie(c *gin.Context, key string) (string, error) {
	cookie, _ := c.Cookie(key)

	if cookie == "" {
		return "", ginjwt.ErrEmptyCookieToken
	}

	return cookie, nil
}

func ParseTokenString(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod(config.SigningAlgorithm()) != t.Method {
			return nil, ginjwt.ErrInvalidSigningAlgorithm
		}

		return config.SecretKeyRememberMeToken(), nil
	})
}

func GetTokenFromJwt(c *gin.Context) (*jwt.Token, error) {
	tokenString, err := jwtFromCookie(c, config.CookieNameRememberMeToken())
	if err != nil {
		return nil, err
	}

	token, err := ParseTokenString(tokenString)
	if err != nil {
		return nil, err
	}
	return token, nil
}

func GetClaimsFromToken(token *jwt.Token) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}
	for key, value := range token.Claims.(jwt.MapClaims) {
		claims[key] = value
	}

	return claims, nil
}

func RememberMeHandler(c *gin.Context) {
	token, err := GetTokenFromJwt(c)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	claims, err := GetClaimsFromToken(token)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	id := claims[config.IdentityKeyRememberMeToken()].(string)

	us := service.NewUserService()

	userID, err := us.GetIDByRememberMeToken(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	newAccessTokenID := uuid.New().String()
	accessToken, err := auth.GenerateAccessToken(c, jwt.MapClaims{
		config.IdentityKeyAccessToken(): newAccessTokenID,
	})

	ss := service.NewSessionService()
	if err := ss.Create(userID, newAccessTokenID, time.Now().Add(time.Hour*12)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newID := uuid.New().String()
	if err := ss.UpdateRememberMeToken(userID, newID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rememberMeToken, err := auth.GenerateRememberMeToken(c, jwt.MapClaims{
		config.IdentityKeyRememberMeToken(): newID,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token":      accessToken,
		"remember_me_token": rememberMeToken,
	})
}
