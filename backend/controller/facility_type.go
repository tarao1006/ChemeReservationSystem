package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type FacilityTypeController struct{}

func NewFacilityTypeController() *FacilityTypeController {
	return &FacilityTypeController{}
}

func (FacilityTypeController) Index(c *gin.Context) {
	s := service.NewFacilityTypeService()
	facilityTypes, err := s.GetAll()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, facilityTypes)
}

func (FacilityTypeController) Create(c *gin.Context) {
	s := service.NewFacilityTypeService()
	ft, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ft)
}

func (FacilityTypeController) Show(c *gin.Context) {
	s := service.NewFacilityTypeService()
	id := c.Params.ByName("id")
	ft, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ft)
}

func (FacilityTypeController) Update(c *gin.Context) {
	s := service.NewFacilityTypeService()
	id := c.Params.ByName("id")
	ft, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ft)
}

func (FacilityTypeController) Delete(c *gin.Context) {
	s := service.NewFacilityTypeService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
