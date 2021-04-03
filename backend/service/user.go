package service

import (
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type UserService struct{}

func NewUserService() *UserService {
	return &UserService{}
}

func (u *UserService) GetAll() ([]model.User, error) {
	db := db.GetDB()
	users := []model.User{}

	if err := db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}
