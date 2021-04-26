package controller

import (
	"fmt"
	"net/http"

	ginjwt "github.com/appleboy/gin-jwt/v2"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/config"
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
		if jwt.GetSigningMethod("HS256") != t.Method {
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

	id := claims[config.IdentityKeyRememberMeToken()]
	fmt.Println(id)
}
