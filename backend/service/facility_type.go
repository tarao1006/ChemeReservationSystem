package service

import (
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
	var ft model.FacilityType

	if err := c.BindJSON(&ft); err != nil {
		return ft, nil
	}

	if err := db.Create(&ft).Error; err != nil {
		return ft, err
	}

	return ft, nil
}

func (FacilityTypeService) GetByID(id string) (model.FacilityType, error) {
	db := db.GetDB()
	var ft model.FacilityType

	if err := db.Where("id = ?", id).First(&ft).Error; err != nil {
		return ft, err
	}

	return ft, nil
}

func (FacilityTypeService) UpdateByID(id string, c *gin.Context) (model.FacilityType, error) {
	db := db.GetDB()
	var ft model.FacilityType

	if err := db.Where("id = ?", id).First(&ft).Error; err != nil {
		return ft, err
	}

	if err := c.BindJSON(&ft); err != nil {
		return ft, nil
	}

	db.Save(&ft)

	return ft, nil
}

func (FacilityTypeService) DeleteByID(id string) error {
	db := db.GetDB()
	if err := db.Where("id = ?", id).Delete(&model.FacilityType{}).Error; err != nil {
		return err
	}
	return nil
}
