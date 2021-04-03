package service

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type FacilityTypeService struct{}

func NewFacilityTypeService() *FacilityTypeService {
	return &FacilityTypeService{}
}

func (FacilityTypeService) GetAll() ([]model.FacilityType, error) {
	db := db.GetDB()
	facilityTypes := []model.FacilityType{}

	if err := db.Find(&facilityTypes).Error; err != nil {
		return nil, err
	}
	return facilityTypes, nil
}

func (FacilityTypeService) Create(c *gin.Context) (model.FacilityType, error) {
	db := db.GetDB()
	var u model.FacilityType

	if err := c.BindJSON(&u); err != nil {
		return u, nil
	}

	if err := db.Create(&u).Error; err != nil {
		return u, err
	}

	return u, nil
}

func (FacilityTypeService) GetByID(id string) (model.FacilityType, error) {
	db := db.GetDB()
	var u model.FacilityType

	if err := db.Where("id = ?", id).First(&u).Error; err != nil {
		return u, err
	}

	return u, nil
}

func (FacilityTypeService) UpdateByID(id string, c *gin.Context) (model.FacilityType, error) {
	db := db.GetDB()
	var u model.FacilityType

	if err := db.Where("id = ?", id).First(&u).Error; err != nil {
		return u, err
	}

	if err := c.BindJSON(&u); err != nil {
		return u, nil
	}

	db.Save(&u)

	return u, nil
}

func (FacilityTypeService) DeleteByID(id string) error {
	db := db.GetDB()
	res := db.Where("id = ?", id)

	fmt.Println(res.Error)

	if err := db.Where("id = ?", id).Delete(&model.FacilityType{}).Error; err != nil {
		return err
	}

	return nil
}
