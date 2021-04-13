package controller

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type AuthController struct {
	IdentityKey string
}

func NewAuthController() *AuthController {
	return &AuthController{
		IdentityKey: "id",
	}
}

/*
login フロー
  1. Authenticator
  2. PayloadFunc
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

// data の型は、 Authenticator の返り値
// 返り値は、claims := jwt.ExtractClaims(c)
// で読むことができる。
func (ac AuthController) PayloadFunc(data interface{}) jwt.MapClaims {
	if v, ok := data.(*model.UserDTO); ok {
		return jwt.MapClaims{
			ac.IdentityKey: v.ID,
		}
	}
	return jwt.MapClaims{}
}

/*
MiddlewareFunc flow
1. IdentityHandler
2. Authorizator
*/

// IdentityHandlerの返り値は、c.Get(identityKey)で取得できる。
func (ac AuthController) IdentityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	return &model.Auth{
		ID: claims[ac.IdentityKey].(string),
	}
}

// 使用していない
// data の型は、 IdentityHandler の返り値
func (AuthController) Authorizator(data interface{}, c *gin.Context) bool {
	return true
}

// 使用していない
func (ac AuthController) Unauthorized(c *gin.Context, code int, message string) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": message,
	})
}
