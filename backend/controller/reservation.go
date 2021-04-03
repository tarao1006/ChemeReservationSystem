package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type ReservationController struct{}

func NewReservationController() *ReservationController {
	return &ReservationController{}
}

func (ReservationController) Index(c *gin.Context) {
	s := service.NewReservationService()
	reservations, err := s.GetAll()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reservations)
}

func (ReservationController) Create(c *gin.Context) {
	s := service.NewReservationService()
	r, err := s.Create(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, r)
}

func (ReservationController) Show(c *gin.Context) {
	s := service.NewReservationService()
	id := c.Params.ByName("id")
	r, err := s.GetByID(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, r)
}

func (ReservationController) Update(c *gin.Context) {
	s := service.NewReservationService()
	id := c.Params.ByName("id")
	r, err := s.UpdateByID(id, c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, r)
}

func (ReservationController) Delete(c *gin.Context) {
	s := service.NewReservationService()
	id := c.Params.ByName("id")

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
