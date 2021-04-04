package service

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type PlanService struct {
	db   *sqlx.DB
	repo *repository.PlanRepository
}

func NewPlanService() *PlanService {
	return &PlanService{
		db:   db.GetDB(),
		repo: repository.NewPlanRepository(),
	}
}

func (ps *PlanService) GetAll() ([]model.Plan, error) {
	return ps.repo.GetAll(ps.db)
}

func (ps *PlanService) GetByID(id int64) (*model.Plan, error) {
	return ps.repo.FindByID(ps.db, id)
}

func (ps *PlanService) Create(c *gin.Context) (*model.Plan, error) {
	var p model.Plan
	if err := c.BindJSON(&p); err != nil {
		return nil, err
	}
	if err := db.TXHandler(ps.db, func(tx *sqlx.Tx) error {
		res, err := ps.repo.Create(tx, p.Name)
		if err != nil {
			return err
		}
		id, err := res.LastInsertId()
		if err != nil {
			return err
		}
		p.ID = id
		return nil
	}); err != nil {
		return nil, err
	}
	return &p, nil
}

func (ps *PlanService) UpdateByID(id int64, c *gin.Context) (*model.Plan, error) {
	var oldP model.Plan
	if err := c.BindJSON(&oldP); err != nil {
		return nil, err
	}
	oldP.ID = id

	if err := db.TXHandler(ps.db, func(tx *sqlx.Tx) error {
		if _, err := ps.repo.Update(tx, oldP.ID, &oldP); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, errors.Wrap(err, "failed update")
	}

	p, err := ps.repo.FindByID(ps.db, id)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func (ps *PlanService) DeleteByID(id int64) error {
	if err := db.TXHandler(ps.db, func(tx *sqlx.Tx) error {
		if _, err := ps.repo.Delete(tx, id); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return errors.Wrap(err, "failed delete")
	}
	return nil
}
