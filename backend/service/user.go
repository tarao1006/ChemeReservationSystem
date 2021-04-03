package service

import (
	"fmt"

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

func (us *UserService) UpdateByID(id string, u model.User) (model.User, error) {
	db := db.GetDB()

	if err := db.Where("id = ?", id).First(&model.User{}).Error; err != nil {
		return u, err
	}

	db.Save(&u)

	return u, nil
}

func (us *UserService) DeleteByID(id string) error {
	db := db.GetDB()
	res := db.Where("id = ?", id)

	fmt.Println(res.Error)

	if err := db.Where("id = ?", id).Delete(&model.User{}).Error; err != nil {
		return err
	}

	return nil
}
