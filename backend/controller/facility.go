package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type FacilityController struct{}

func NewFacilityController() *FacilityController {
	return &FacilityController{}
}

func (FacilityController) Index(c *gin.Context) {
	s := service.NewFacilityService()

	facilities, err := s.GetAll()

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		fmt.Println(err)
	} else {
		c.JSON(http.StatusOK, facilities)
	}
}

func (FacilityController) Create(c *gin.Context) {
	s := service.NewFacilityService()

	f, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, f)
}

func (FacilityController) Show(c *gin.Context) {
	s := service.NewFacilityService()
	id := c.Params.ByName("id")

	f, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, f)
}

func (FacilityController) Update(c *gin.Context) {
	s := service.NewFacilityService()
	id := c.Params.ByName("id")

	f, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, f)
}

func (FacilityController) Delete(c *gin.Context) {
	s := service.NewFacilityService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
