package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type ReservationController struct{}

func NewReservationController() *ReservationController {
	return &ReservationController{}
}

func parseQuery(r *model.RangeAPI) (*model.DateRange, error) {
	layout := "2006-01-02"
	loc, _ := time.LoadLocation("Asia/Tokyo")
	f, err := time.ParseInLocation(layout, r.From, loc)
	if err != nil {
		return nil, err
	}
	t, err := time.ParseInLocation(layout, r.To, loc)
	if err != nil {
		return nil, err
	}

	if f.After(t) {
		return nil, model.ErrInvalidValue
	}

	return &model.DateRange{
		From: f,
		To:   t,
	}, nil
}

func (ReservationController) Index(c *gin.Context) {
	s := service.NewReservationService()

	var r model.RangeAPI
	if err := c.ShouldBindQuery(&r); err != nil {
		reservations, err := s.GetAll()
		if err != nil {
			ErrResponse(c, http.StatusNotFound, err)
			return
		}
		c.JSON(http.StatusOK, reservations)
	} else {
		res, err := parseQuery(&r)
		if err != nil {
			ErrResponse(c, http.StatusBadRequest, model.ErrInvalidQuery)
			return
		}
		reservations, err := s.GetAllInRange(res)
		if err != nil {
			ErrResponse(c, http.StatusNotFound, err)
			return
		}
		c.JSON(http.StatusOK, reservations)
	}
}

func (ReservationController) Create(c *gin.Context) {
	s := service.NewReservationService()
	var r model.ReservationAPI
	if err := c.BindJSON(&r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newR, err := s.Create(&r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newR)
}

func (ReservationController) Show(c *gin.Context) {
	s := service.NewReservationService()
	id, err := strconv.ParseInt(c.Params.ByName("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	r, err := s.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, r)
}

func (ReservationController) Update(c *gin.Context) {
	if v, exist := c.Get("plan_memo"); exist {
		fmt.Println(v)
	}
	s := service.NewReservationService()
	id, err := strconv.ParseInt(c.Params.ByName("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var r model.ReservationAPI
	if err := c.BindJSON(&r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newR, err := s.UpdateByID(id, &r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newR)
}

func (ReservationController) Delete(c *gin.Context) {
	s := service.NewReservationService()
	id, err := strconv.ParseInt(c.Params.ByName("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := s.DeleteByID(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
