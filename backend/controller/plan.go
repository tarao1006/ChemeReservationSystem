package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type PlanController struct{}

func NewPlanController() *PlanController {
	return &PlanController{}
}

func (PlanController) Index(c *gin.Context) {
	s := service.NewPlanService()
	plans, err := s.GetAll()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, plans)
}

func (PlanController) Create(c *gin.Context) {
	s := service.NewPlanService()
	p, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, p)
}

func (PlanController) Show(c *gin.Context) {
	s := service.NewPlanService()
	id := c.Params.ByName("id")
	p, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, p)
}

func (PlanController) Update(c *gin.Context) {
	s := service.NewPlanService()
	id := c.Params.ByName("id")
	p, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, p)
}

func (PlanController) Delete(c *gin.Context) {
	s := service.NewPlanService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
