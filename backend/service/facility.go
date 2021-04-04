package service

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type FacilityService struct {
	db   *sqlx.DB
	repo *repository.FacilityRepository
}

func NewFacilityService() *FacilityService {
	return &FacilityService{
		db:   db.GetDB(),
		repo: repository.NewFacilityRepository(),
	}
}

func (fs *FacilityService) GetAll() ([]model.Facility, error) {
	return fs.repo.GetAll(fs.db)
}

func (fs *FacilityService) GetByID(id int64) (*model.Facility, error) {
	return fs.repo.FindByID(fs.db, id)
}

func (fs *FacilityService) Create(c *gin.Context) (*model.Facility, error) {
	var (
		f  model.FacilityAPI
		id int64
	)
	if err := c.BindJSON(&f); err != nil {
		return nil, err
	}
	if err := db.TXHandler(fs.db, func(tx *sqlx.Tx) error {
		var (
			res sql.Result
			err error
		)
		res, err = fs.repo.Create(tx, &model.FacilityDTO{Name: f.Name})
		if err != nil {
			return err
		}
		id, err = res.LastInsertId()
		if err != nil {
			return err
		}

		for _, ft := range f.Types {
			_, err = fs.repo.AddGroup(tx, id, ft)
			if err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	facility, err := fs.repo.FindByID(fs.db, id)
	if err != nil {
		return nil, err
	}
	return facility, nil
}

func (fs *FacilityService) DeleteByID(id int64) error {
	if err := db.TXHandler(fs.db, func(tx *sqlx.Tx) error {
		var err error
		_, err = fs.repo.RemoveGroup(tx, id)
		if err != nil {
			return err
		}
		_, err = fs.repo.Delete(tx, id)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
