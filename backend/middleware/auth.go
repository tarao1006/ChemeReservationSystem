package middleware

import (
	"net/http"
	"time"

	ginjwt "github.com/appleboy/gin-jwt/v2"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

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

func GenerateRememberMeToken(c *gin.Context, data jwt.MapClaims) error {
	tokenString, _, err := TokenGenerator(data, config.SecretKeyRememberMeToken(), config.TimeoutRememberMeToken())
	if err != nil {
		return err
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

	return nil
}

func GenerateAccessToken(c *gin.Context, data jwt.MapClaims) error {
	tokenString, _, err := TokenGenerator(data, config.SecretKeyAccessToken(), config.TimeoutAccessToken())
	if err != nil {
		return err
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

	return nil
}

/*
LoginHandler   : Authenticator -> PayloadFunc
MiddlewareFunc : IdentityHandler -> Authorizator
*/

// Authenticator は {id: "id", password: "password"} を用いて、
// 有効なユーザーであるかを検証する。
func Authenticator(c *gin.Context) (interface{}, error) {
	s := service.NewAuthService()
	var auth model.Auth
	if err := c.BindJSON(&auth); err != nil {
		return nil, err
	}

	user, err := s.Login(&auth)
	if err != nil {
		return nil, ginjwt.ErrMissingLoginValues
	}

	if auth.RememberMe {
		s := service.NewAuthService()

		id := uuid.New().String()
		if err := s.UpdateRememberMeToken(user.ID, id); err != nil {
			return nil, ginjwt.ErrMissingLoginValues
		}

		if err := GenerateRememberMeToken(c, jwt.MapClaims{
			"id": id,
		}); err != nil {
			return nil, ginjwt.ErrMissingLoginValues
		}
	}

	return user, nil
}

// PayloadFunc は Authenticator の戻り値を用いて MapClaims を生成する。
// 生成された MapClaims の値は jwt 生成に用いられる。
func PayloadFunc(data interface{}) ginjwt.MapClaims {
	if v, ok := data.(*model.UserDTO); ok {
		return ginjwt.MapClaims{
			"id": v.ID,
		}
	}
	return ginjwt.MapClaims{}
}

// IdentityHandler の返り値は、コントローラ内で、c.Get(identityKey)で取得できる。
func IdentityHandler(c *gin.Context) interface{} {
	claims := ginjwt.ExtractClaims(c)
	return &model.Auth{
		ID: claims[config.IdentityKeyAccessToken()].(string),
	}
}

func LoginResponse(c *gin.Context, code int, token string, expire time.Time) {
	c.JSON(http.StatusOK, gin.H{
		config.IdentityKeyAccessToken():     token,
		config.IdentityKeyRememberMeToken(): c.GetString(config.IdentityKeyRememberMeToken()),
	})
}

func AuthMiddleware() (*ginjwt.GinJWTMiddleware, error) {
	return ginjwt.New(&ginjwt.GinJWTMiddleware{
		Realm:           config.Realm(),
		Key:             config.SecretKeyAccessToken(),
		Timeout:         config.TimeoutAccessToken(),
		MaxRefresh:      time.Hour,
		IdentityKey:     config.IdentityKeyAccessToken(),
		PayloadFunc:     PayloadFunc,
		LoginResponse:   LoginResponse,
		IdentityHandler: IdentityHandler,
		Authenticator:   Authenticator,
		TokenLookup:     "header: Authorization, cookie: " + config.CookieNameAccessToken(),
		TokenHeadName:   "Bearer",
		TimeFunc:        time.Now,
		SendCookie:      true,
		SecureCookie:    false,
		CookieHTTPOnly:  true,
		CookieName:      config.CookieNameAccessToken(),
	})
}
