package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

func (uc *UserController) Index(c *gin.Context) {
	s := service.NewUserService()

	users, err := s.GetAll()

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		fmt.Println(err)
	} else {
		c.JSON(http.StatusOK, users)
	}
}

func (uc *UserController) Create(c *gin.Context) {
	s := service.NewUserService()
	u, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

func (uc *UserController) Show(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")

	u, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

func (uc *UserController) Update(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")
	u, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

func (uc *UserController) Delete(c *gin.Context) {
	s := service.NewUserService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
