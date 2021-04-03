package service

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type FacilityService struct{}

func NewFacilityService() *FacilityService {
	return &FacilityService{}
}

func (FacilityService) GetAll() ([]model.Facility, error) {
	db := db.GetDB()
	facilities := []model.Facility{}

	if err := db.Find(&facilities).Error; err != nil {
		return nil, err
	}
	return facilities, nil
}

func (FacilityService) Create(c *gin.Context) (model.Facility, error) {
	db := db.GetDB()
	var f model.Facility

	if err := c.BindJSON(&f); err != nil {
		return f, err
	}

	if err := db.Create(&f).Error; err != nil {
		return f, err
	}

	return f, nil
}

func (FacilityService) GetByID(id string) (model.Facility, error) {
	db := db.GetDB()
	var f model.Facility

	if err := db.Where("id = ?", id).First(&f).Error; err != nil {
		return f, err
	}

	return f, nil
}

func (FacilityService) UpdateByID(id string, c *gin.Context) (model.Facility, error) {
	db := db.GetDB()
	var f model.Facility

	if err := db.Where("id = ?", id).First(&f).Error; err != nil {
		return f, err
	}

	if err := c.BindJSON(&f); err != nil {
		return f, err
	}

	db.Save(&f)

	return f, nil
}

func (FacilityService) DeleteByID(id string) error {
	db := db.GetDB()
	res := db.Where("id = ?", id)

	fmt.Println(res.Error)

	if err := db.Where("id = ?", id).Delete(&model.Facility{}).Error; err != nil {
		return err
	}

	return nil
}
