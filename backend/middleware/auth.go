package middleware

import (
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/tarao1006/ChemeReservationSystem/controller"
)

var identityKey = "email_address"

func AuthMiddleware() (*jwt.GinJWTMiddleware, error) {
	c := controller.NewAuthController()
	return jwt.New(&jwt.GinJWTMiddleware{
		Realm:          "test zone",
		Key:            []byte("secret key"),
		Timeout:        time.Hour,
		MaxRefresh:     time.Hour,
		IdentityKey:    identityKey,
		PayloadFunc:    c.PayloadFunc,
		Authenticator:  c.Authenticator,
		TokenLookup:    "header: Authorization, query: token, cookie: jwt",
		TokenHeadName:  "Bearer",
		TimeFunc:       time.Now,
		SendCookie:     true,
		SecureCookie:   false,
		CookieHTTPOnly: true,
		CookieName:     "jwt",
	})
}
