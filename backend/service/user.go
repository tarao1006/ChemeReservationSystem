package service

import (
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type UserService struct{}

func NewUserService() *UserService {
	return &UserService{}
}

func (us *UserService) GetAll() ([]model.User, error) {
	db := db.GetDB()
	users := []model.User{}

	if err := db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (us *UserService) Create(u model.User) (model.User, error) {
	db := db.GetDB()

	if err := db.Create(&u).Error; err != nil {
		return u, err
	}
	return u, nil
}

func (us *UserService) GetByID(id string) (model.User, error) {
	db := db.GetDB()
	var u model.User

	if err := db.Where("id = ?", id).First(&u).Error; err != nil {
		return u, err
	}

	return u, nil
}
