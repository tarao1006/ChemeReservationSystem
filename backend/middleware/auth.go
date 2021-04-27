package middleware

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

/*
LoginHandler   : Authenticator -> PayloadFunc
MiddlewareFunc : IdentityHandler -> Authorizator
*/

// Authenticator は {id: "id", password: "password"} を用いて、
// 有効なユーザーであるかを検証する。
func Authenticator(c *gin.Context) (interface{}, error) {
	s := service.NewSessionService()
	var a auth.Auth
	if err := c.BindJSON(&a); err != nil {
		return nil, err
	}

	if err := s.Login(&a); err != nil {
		return nil, ginjwt.ErrMissingLoginValues
	}

	ss := service.NewSessionService()
	accessTokenID := uuid.New().String()
	if err := ss.Create(a.ID, accessTokenID, time.Now().Add(time.Hour*12)); err != nil {
		return nil, err
	}

	if a.RememberMe {
		rememberMeTokenID := uuid.New().String()
		if err := s.UpdateRememberMeToken(a.ID, rememberMeTokenID); err != nil {
			return nil, ginjwt.ErrMissingLoginValues
		}

		if _, err := auth.GenerateRememberMeToken(c, jwt.MapClaims{
			config.IdentityKeyRememberMeToken(): rememberMeTokenID,
		}); err != nil {
			return nil, ginjwt.ErrMissingLoginValues
		}
	}

	return accessTokenID, nil
}

// PayloadFunc は Authenticator の戻り値を用いて MapClaims を生成する。
// 生成された MapClaims の値は jwt 生成に用いられる。
func PayloadFunc(data interface{}) ginjwt.MapClaims {
	if v, ok := data.(string); ok {
		return ginjwt.MapClaims{
			config.IdentityKeyAccessToken(): v,
		}
	}
	return ginjwt.MapClaims{}
}

// IdentityHandler の返り値は、コントローラ内で、c.Get(identityKey)で取得できる。
func IdentityHandler(c *gin.Context) interface{} {
	claims := ginjwt.ExtractClaims(c)
	return claims[config.IdentityKeyAccessToken()].(string)
}

func LoginResponse(c *gin.Context, code int, token string, expire time.Time) {
	c.JSON(http.StatusOK, gin.H{
		"access_token":      token,
		"remember_me_token": c.GetString(config.IdentityKeyRememberMeToken()),
	})
}

func Authorizator(data interface{}, c *gin.Context) bool {
	return true
}

func AuthMiddleware() (*ginjwt.GinJWTMiddleware, error) {
	return ginjwt.New(&ginjwt.GinJWTMiddleware{
		Realm:            config.Realm(),
		SigningAlgorithm: config.SigningAlgorithm(),
		Key:              config.SecretKeyAccessToken(),
		Timeout:          config.TimeoutAccessToken(),
		MaxRefresh:       time.Hour,
		Authenticator:    Authenticator,
		Authorizator:     Authorizator,
		PayloadFunc:      PayloadFunc,
		LoginResponse:    LoginResponse,
		IdentityHandler:  IdentityHandler,
		IdentityKey:      config.IdentityKeyAccessToken(),
		TokenLookup:      "header: Authorization, cookie: " + config.CookieNameAccessToken(),
		TokenHeadName:    "Bearer",
		TimeFunc:         time.Now,
		SendCookie:       true,
		SecureCookie:     false,
		CookieHTTPOnly:   true,
		CookieName:       config.CookieNameAccessToken(),
	})
}
