package service

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type FacilityTypeService struct {
	db   *sqlx.DB
	repo *repository.FacilityTypeRepository
}

func NewFacilityTypeService() *FacilityTypeService {
	return &FacilityTypeService{
		db:   db.GetDB(),
		repo: repository.NewFacilityTypeRepository(),
	}
}

func (fts *FacilityTypeService) GetAll() ([]model.FacilityType, error) {
	return fts.repo.GetAll(fts.db)
}

func (fts *FacilityTypeService) GetByID(id int64) (*model.FacilityType, error) {
	return fts.repo.FindByID(fts.db, id)
}

func (fts *FacilityTypeService) Create(c *gin.Context) (*model.FacilityType, error) {
	var ft model.FacilityType
	if err := c.BindJSON(&ft); err != nil {
		return nil, err
	}
	if err := db.TXHandler(fts.db, func(tx *sqlx.Tx) error {
		res, err := fts.repo.Create(tx, ft.Name)
		if err != nil {
			return err
		}
		id, err := res.LastInsertId()
		if err != nil {
			return err
		}
		ft.ID = id
		return nil
	}); err != nil {
		return nil, err
	}
	return &ft, nil
}

func (fts *FacilityTypeService) UpdateByID(c *gin.Context, id int64) (*model.FacilityType, error) {
	var oldFt model.FacilityType
	if err := c.BindJSON(&oldFt); err != nil {
		return nil, err
	}
	oldFt.ID = id

	if err := db.TXHandler(fts.db, func(tx *sqlx.Tx) error {
		if _, err := fts.repo.Update(tx, oldFt.ID, &oldFt); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, errors.Wrap(err, "failed update")
	}

	ft, err := fts.repo.FindByID(fts.db, id)
	if err != nil {
		return nil, err
	}

	return ft, nil
}

func (fts *FacilityTypeService) DeleteByID(id int64) error {
	if err := db.TXHandler(fts.db, func(tx *sqlx.Tx) error {
		if _, err := fts.repo.Delete(tx, id); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return errors.Wrap(err, "failed delete")
	}
	return nil
}
