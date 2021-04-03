package controller

import (
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
	userTypes, err := s.GetAll()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, userTypes)
}

func (UserTypeController) Create(c *gin.Context) {
	s := service.NewUserTypeService()
	ut, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ut)
}

func (UserTypeController) Show(c *gin.Context) {
	s := service.NewUserTypeService()
	id := c.Params.ByName("id")
	ut, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ut)
}

func (UserTypeController) Update(c *gin.Context) {
	s := service.NewUserTypeService()
	id := c.Params.ByName("id")
	ut, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ut)
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
