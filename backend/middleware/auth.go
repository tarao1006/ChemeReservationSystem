package middleware

import (
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/controller"
)

func AuthMiddleware() (*jwt.GinJWTMiddleware, error) {
	c := controller.NewAuthController()
	return jwt.New(&jwt.GinJWTMiddleware{
		Realm:           config.Realm(),
		Key:             config.SecretKey(),
		Timeout:         time.Hour * 24 * (365*3 + 366),
		MaxRefresh:      time.Hour,
		IdentityKey:     c.IdentityKey,
		PayloadFunc:     c.PayloadFunc,
		IdentityHandler: c.IdentityHandler,
		Authenticator:   c.Authenticator,
		TokenLookup:     "header: Authorization, query: token, cookie: jwt",
		TokenHeadName:   "Bearer",
		TimeFunc:        time.Now,
		SendCookie:      true,
		SecureCookie:    false,
		CookieHTTPOnly:  true,
		CookieName:      config.CookieName(),
	})
}
