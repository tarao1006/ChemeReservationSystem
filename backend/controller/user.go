package controller

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

func (UserController) Index(c *gin.Context) {
	s := service.NewUserService()
	users, err := s.GetAll()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (UserController) Create(c *gin.Context) {
	s := service.NewUserService()

	var u model.UserAPI
	if err := c.BindJSON(&u); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newU, err := s.Create(&u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newU)
}

func (UserController) Show(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")
	u, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, u)
}

func (UserController) ShowMe(c *gin.Context) {
	s := service.NewUserService()
	claims := jwt.ExtractClaims(c)
	id := claims[config.IdentityKey()].(string)
	u, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, u)
}

type RememberMeData struct {
	UserID                string `json:"user_id"`
	RememberMeTokenDigest []byte `json:"remember_me_token_digest"`
}

func (UserController) GetRememberMeTokenDigest(jwt string) (*RememberMeData, error) {
	splittedJWT := strings.Split(jwt, ".")
	if len(splittedJWT) != 3 {
		return nil, fmt.Errorf("invalid token")
	}

	tokenByte, err := base64.RawStdEncoding.DecodeString(splittedJWT[1])
	if err != nil {
		return nil, err
	}

	var res RememberMeData
	if err := json.Unmarshal(tokenByte, &res); err != nil {
		return nil, err
	}

	return &res, nil
}

func (uc *UserController) ShowRememberedUser(c *gin.Context) {
	jwt, err := c.Cookie(config.RememberMeTokenCookieName())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	data, err := uc.GetRememberMeTokenDigest(jwt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	s := service.NewUserService()
	u, err := s.GetRememberedUser(data.UserID, data.RememberMeTokenDigest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

type ValidationData struct {
	UserID string `json:"user_id"`
}

func (UserController) ValidateUserID(c *gin.Context) {
	s := service.NewUserService()

	var v ValidationData
	if err := c.BindJSON(&v); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id := v.UserID
	count, err := s.CountUser(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if count == 0 {
		c.JSON(http.StatusOK, gin.H{"valid": false})
	} else {
		c.JSON(http.StatusOK, gin.H{"valid": true})
	}
}

func (UserController) Update(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")

	var u model.UserAPI
	if err := c.BindJSON(&u); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newU, err := s.UpdateByID(id, &u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newU)
}

func (UserController) UpdatePassword(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")

	var p model.Password
	if err := c.BindJSON(&p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	u, err := s.UpdatePasswordByID(id, &p)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, u)
}

func (UserController) Delete(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
