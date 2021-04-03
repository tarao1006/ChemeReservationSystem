package service

import (
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type ReservationService struct{}

func NewReservationService() *ReservationService {
	return &ReservationService{}
}

func (ReservationService) GetAll() ([]model.Reservation, error) {
	db := db.GetDB()
	reservations := []model.Reservation{}

	if err := db.Find(&reservations).Error; err != nil {
		return nil, err
	}
	return reservations, nil
}

func (ReservationService) Create(c *gin.Context) (model.Reservation, error) {
	db := db.GetDB()
	var r model.Reservation

	if err := c.BindJSON(&r); err != nil {
		return r, nil
	}

	if err := db.Create(&r).Error; err != nil {
		return r, err
	}

	return r, nil
}

func (ReservationService) GetByID(id string) (model.Reservation, error) {
	db := db.GetDB()
	var r model.Reservation

	if err := db.Where("id = ?", id).First(&r).Error; err != nil {
		return r, err
	}

	return r, nil
}

func (ReservationService) UpdateByID(id string, c *gin.Context) (model.Reservation, error) {
	db := db.GetDB()
	var r model.Reservation

	if err := db.Where("id = ?", id).First(&r).Error; err != nil {
		return r, err
	}

	if err := c.BindJSON(&r); err != nil {
		return r, nil
	}

	db.Save(&r)

	return r, nil
}

func (ReservationService) DeleteByID(id string) error {
	db := db.GetDB()
	if err := db.Where("id = ?", id).Delete(&model.Reservation{}).Error; err != nil {
		return err
	}
	return nil
}
