package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
	id := c.GetString("USER_ID")
	u, err := s.GetByID(id)

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
	exists, err := s.ExistsUser(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": model.ErrInvalidUserID.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"valid": true})
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
