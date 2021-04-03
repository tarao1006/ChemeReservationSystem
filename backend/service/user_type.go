package service

import (
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type UserTypeService struct{}

func NewUserTypeService() *UserTypeService {
	return &UserTypeService{}
}

func (UserTypeService) GetAll() ([]model.UserType, error) {
	db := db.GetDB()
	userTypes := []model.UserType{}

	if err := db.Find(&userTypes).Error; err != nil {
		return nil, err
	}
	return userTypes, nil
}

func (UserTypeService) Create(c *gin.Context) (model.UserType, error) {
	db := db.GetDB()
	var u model.UserType

	if err := c.BindJSON(&u); err != nil {
		return u, nil
	}

	if err := db.Create(&u).Error; err != nil {
		return u, err
	}

	return u, nil
}

func (UserTypeService) GetByID(id string) (model.UserType, error) {
	db := db.GetDB()
	var u model.UserType

	if err := db.Where("id = ?", id).First(&u).Error; err != nil {
		return u, err
	}

	return u, nil
}

func (UserTypeService) UpdateByID(id string, c *gin.Context) (model.UserType, error) {
	db := db.GetDB()
	var u model.UserType

	if err := db.Where("id = ?", id).First(&u).Error; err != nil {
		return u, err
	}

	if err := c.BindJSON(&u); err != nil {
		return u, nil
	}

	db.Save(&u)

	return u, nil
}

func (UserTypeService) DeleteByID(id string) error {
	db := db.GetDB()
	if err := db.Where("id = ?", id).Delete(&model.UserType{}).Error; err != nil {
		return err
	}
	return nil
}
