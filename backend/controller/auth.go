package controller

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
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

// Authenticator は {id: "id", password: "password"}
// を用いて有効なユーザーであるかを検証する。
// この関数で返す interface{} は PayloadFunc に渡される。
func (AuthController) Authenticator(c *gin.Context) (interface{}, error) {
	s := service.NewAuthService()

	user, err := s.Login(c)
	if err != nil {
		return nil, jwt.ErrMissingLoginValues
	}

	return user, nil
}

// PayloadFunc は Authenticator の戻り値を用いて
// Claims を生成し、 claims := jwt.ExtractClaims(c)
// で取得することができるようにする。
func (ac AuthController) PayloadFunc(data interface{}) jwt.MapClaims {
	if v, ok := data.(*model.UserDTO); ok {
		return jwt.MapClaims{
			ac.IdentityKey: v.ID,
		}
	}
	return jwt.MapClaims{}
}

// IdentityHandler の返り値は、c.Get(identityKey)で取得できる。
func (ac AuthController) IdentityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	return &model.Auth{
		ID: claims[ac.IdentityKey].(string),
	}
}
