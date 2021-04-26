package middleware

import (
	"fmt"
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

func TokenGenerator(data jwt.MapClaims) (string, time.Time, error) {
	token := jwt.New(jwt.GetSigningMethod("HS256"))
	claims := token.Claims.(jwt.MapClaims)

	for key, value := range data {
		claims[key] = value
	}

	expire := time.Now().UTC().Add(time.Hour * 24 * (365*3 + 366))
	claims["exp"] = expire.Unix()
	claims["orig_iat"] = time.Now().Unix()
	tokenString, err := token.SignedString(config.SecretKeyRememberMeToken())
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expire, nil
}

func GenerateRememberMeToken(c *gin.Context, userId string) error {
	s := service.NewAuthService()

	id := uuid.New().String()

	if err := s.UpdateRememberMeToken(userId, id); err != nil {
		return err
	}

	tokenString, _, err := TokenGenerator(jwt.MapClaims{
		"token": id,
	})
	if err != nil {
		return err
	}
	fmt.Println(tokenString)
	fmt.Println(config.IdentityKeyRememberMeToken())

	c.Set(config.IdentityKeyRememberMeToken(), tokenString)
	c.SetCookie(
		config.CookieNameRememberMeToken(),
		tokenString,
		60*60*24*(365*3+366),
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
		if err := GenerateRememberMeToken(c, user.ID); err != nil {
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
			config.IdentityKeyAccessToken(): v.ID,
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
		"token":             token,
		"remember_me_token": c.GetString(config.IdentityKeyRememberMeToken()),
	})
}

func AuthMiddleware() (*ginjwt.GinJWTMiddleware, error) {
	return ginjwt.New(&ginjwt.GinJWTMiddleware{
		Realm:           config.Realm(),
		Key:             config.SecretKeyAccessToken(),
		Timeout:         time.Hour * 24 * (365*3 + 366),
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
