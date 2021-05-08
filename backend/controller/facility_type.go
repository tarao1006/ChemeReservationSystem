package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/model"
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, facilityTypes)
}

func (FacilityTypeController) Create(c *gin.Context) {
	s := service.NewFacilityTypeService()
	var ft model.FacilityType
	if err := c.BindJSON(&ft); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newFt, err := s.Create(&ft)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newFt)
}

func (FacilityTypeController) Show(c *gin.Context) {
	s := service.NewFacilityTypeService()
	id, err := strconv.ParseInt(c.Params.ByName("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ft, err := s.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ft)
}

func (FacilityTypeController) Update(c *gin.Context) {
	s := service.NewFacilityTypeService()
	id, err := strconv.ParseInt(c.Params.ByName("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var ft model.FacilityType
	if err := c.BindJSON(&ft); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newFt, err := s.UpdateByID(id, &ft)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newFt)
}

func (FacilityTypeController) Delete(c *gin.Context) {
	s := service.NewFacilityTypeService()
	id, err := strconv.ParseInt(c.Params.ByName("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := s.DeleteByID(id); err != nil {
		if err == model.ErrBelongToFacilityType {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "msssage": "deleted"})
}
