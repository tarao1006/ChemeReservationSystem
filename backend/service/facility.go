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
	var f model.Facility
	if err := c.BindJSON(&f); err != nil {
		return nil, err
	}
	if err := db.TXHandler(fs.db, func(tx *sqlx.Tx) error {
		var (
			res sql.Result
			err error
		)
		res, err = fs.repo.Create(tx, f.Name)
		if err != nil {
			return err
		}
		id, err := res.LastInsertId()
		if err != nil {
			return err
		}
		f.ID = id

		for _, ft := range f.Types {
			_, err = fs.repo.AddGroup(tx, f.ID, ft.ID)
			if err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return &f, nil
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
