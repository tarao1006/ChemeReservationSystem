package service

import (
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type PlanService struct{}

func NewPlanService() *PlanService {
	return &PlanService{}
}

func (PlanService) GetAll() ([]model.Plan, error) {
	db := db.GetDB()
	plans := []model.Plan{}

	if err := db.Find(&plans).Error; err != nil {
		return nil, err
	}
	return plans, nil
}

func (PlanService) Create(c *gin.Context) (model.Plan, error) {
	db := db.GetDB()
	var p model.Plan

	if err := c.BindJSON(&p); err != nil {
		return p, nil
	}

	if err := db.Create(&p).Error; err != nil {
		return p, err
	}

	return p, nil
}

func (PlanService) GetByID(id string) (model.Plan, error) {
	db := db.GetDB()
	var p model.Plan

	if err := db.Where("id = ?", id).First(&p).Error; err != nil {
		return p, err
	}

	return p, nil
}

func (PlanService) UpdateByID(id string, c *gin.Context) (model.Plan, error) {
	db := db.GetDB()
	var p model.Plan

	if err := db.Where("id = ?", id).First(&p).Error; err != nil {
		return p, err
	}

	if err := c.BindJSON(&p); err != nil {
		return p, nil
	}

	db.Save(&p)

	return p, nil
}

func (PlanService) DeleteByID(id string) error {
	db := db.GetDB()
	if err := db.Where("id = ?", id).Delete(&model.Plan{}).Error; err != nil {
		return err
	}
	return nil
}
