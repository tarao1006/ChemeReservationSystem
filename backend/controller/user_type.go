package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type UserTypeController struct{}

func NewUserTypeController() *UserTypeController {
	return &UserTypeController{}
}

func (UserTypeController) Index(c *gin.Context) {
	s := service.NewUserTypeService()

	users, err := s.GetAll()

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		fmt.Println(err)
	} else {
		c.JSON(http.StatusOK, users)
	}
}

func (UserTypeController) Create(c *gin.Context) {
	s := service.NewUserTypeService()
	u, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

func (UserTypeController) Show(c *gin.Context) {
	s := service.NewUserTypeService()
	id := c.Params.ByName("id")

	u, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

func (UserTypeController) Update(c *gin.Context) {
	s := service.NewUserTypeService()
	id := c.Params.ByName("id")
	u, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, u)
}

func (UserTypeController) Delete(c *gin.Context) {
	s := service.NewUserTypeService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
