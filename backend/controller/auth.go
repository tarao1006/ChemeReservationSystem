package controller

import (
	"net/http"
	"time"

	ginjwt "github.com/appleboy/gin-jwt/v2"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	IdentityKey string
}

func NewAuthController() *AuthController {
	return &AuthController{
		IdentityKey: config.IdentityKey(),
	}
}

/*
LoginHandler   : Authenticator -> PayloadFunc
MiddlewareFunc : IdentityHandler -> Authorizator
*/

// Authenticator は {id: "id", password: "password"} を用いて、
// 有効なユーザーであるかを検証する。
func (AuthController) Authenticator(c *gin.Context) (interface{}, error) {
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
		UUID, err := uuid.NewUUID()
		if err != nil {
			return nil, err
		}
		t := []byte(UUID.String())
		hashed, err := bcrypt.GenerateFromPassword(t, 10)
		if err != nil {
			return nil, err
		}
		if err := s.UpdateRememberMeToken(user.ID, t); err != nil {
			return nil, err
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"remember_me_token_digest": hashed,
			"user_id":                  user.ID,
		})

		tokenString, err := token.SignedString(config.RememberMeTokenSecretKey())
		if err != nil {
			return nil, err
		}

		c.Set(config.RememberTokenKey(), tokenString)
		c.SetCookie(
			config.RememberMeTokenCookieName(),
			tokenString,
			60*60*24*(365*3+366),
			"/",
			"",
			false,
			true,
		)
	}

	return user, nil
}

// PayloadFunc は Authenticator の戻り値を用いて MapClaims を生成する。
// 生成された MapClaims の値は jwt 生成に用いられる。
func (ac AuthController) PayloadFunc(data interface{}) ginjwt.MapClaims {
	if v, ok := data.(*model.UserDTO); ok {
		return ginjwt.MapClaims{
			ac.IdentityKey: v.ID,
		}
	}
	return ginjwt.MapClaims{}
}

// IdentityHandler の返り値は、コントローラ内で、c.Get(identityKey)で取得できる。
func (ac AuthController) IdentityHandler(c *gin.Context) interface{} {
	claims := ginjwt.ExtractClaims(c)
	return &model.Auth{
		ID: claims[ac.IdentityKey].(string),
	}
}

func (ac AuthController) LoginResponse(c *gin.Context, code int, token string, expire time.Time) {
	c.JSON(http.StatusOK, gin.H{
		"token":             token,
		"remember_me_token": c.GetString(config.RememberTokenKey()),
	})
}
