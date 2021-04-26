package auth

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/config"
)

type Auth struct {
	ID         string `json:"id"`
	Password   string `json:"password"`
	RememberMe bool   `json:"remember_me"`
}

func TokenGenerator(data jwt.MapClaims, secretKey []byte, timeout time.Duration) (string, time.Time, error) {
	token := jwt.New(jwt.GetSigningMethod("HS256"))
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

func GenerateRememberMeToken(c *gin.Context, data jwt.MapClaims) (string, error) {
	tokenString, _, err := TokenGenerator(data, config.SecretKeyRememberMeToken(), config.TimeoutRememberMeToken())
	if err != nil {
		return "", err
	}

	expireCookie := time.Now().Add(config.TimeoutRememberMeToken())
	maxage := int(expireCookie.Unix() - time.Now().Unix())

	c.Set(config.IdentityKeyRememberMeToken(), tokenString)
	c.SetCookie(
		config.CookieNameRememberMeToken(),
		tokenString,
		maxage,
		"/",
		"",
		false,
		true,
	)

	return tokenString, nil
}

func GenerateAccessToken(c *gin.Context, data jwt.MapClaims) (string, error) {
	tokenString, _, err := TokenGenerator(data, config.SecretKeyAccessToken(), config.TimeoutAccessToken())
	if err != nil {
		return "", err
	}

	expireCookie := time.Now().Add(config.TimeoutAccessToken())
	maxage := int(expireCookie.Unix() - time.Now().Unix())

	c.Set(config.IdentityKeyAccessToken(), tokenString)
	c.SetCookie(
		config.CookieNameAccessToken(),
		tokenString,
		maxage,
		"/",
		"",
		false,
		true,
	)

	return tokenString, nil
}
