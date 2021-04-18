package service

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type UserTypeService struct {
	db   *sqlx.DB
	repo *repository.UserTypeRepository
}

func NewUserTypeService() *UserTypeService {
	return &UserTypeService{
		db:   db.GetDB(),
		repo: repository.NewUserTypeRepository(),
	}
}

func (uts *UserTypeService) GetAll() ([]model.UserType, error) {
	return uts.repo.GetAll(uts.db)
}

func (uts *UserTypeService) GetByID(id int64) (*model.UserType, error) {
	return uts.repo.FindByID(uts.db, id)
}

func (uts *UserTypeService) Create(c *gin.Context) (*model.UserType, error) {
	var ut model.UserType
	if err := c.BindJSON(&ut); err != nil {
		return nil, err
	}
	if err := db.TXHandler(uts.db, func(tx *sqlx.Tx) error {
		res, err := uts.repo.Create(tx, &ut)
		if err != nil {
			return err
		}
		id, err := res.LastInsertId()
		if err != nil {
			return err
		}
		ut.ID = id
		return nil
	}); err != nil {
		return nil, err
	}
	return &ut, nil
}

func (uts *UserTypeService) UpdateByID(id int64, c *gin.Context) (*model.UserType, error) {
	var oldUt model.UserType
	if err := c.BindJSON(&oldUt); err != nil {
		return nil, err
	}
	oldUt.ID = id

	if err := db.TXHandler(uts.db, func(tx *sqlx.Tx) error {
		if _, err := uts.repo.Update(tx, oldUt.ID, &oldUt); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, errors.Wrap(err, "failed update")
	}

	ut, err := uts.repo.FindByID(uts.db, id)
	if err != nil {
		return nil, err
	}

	return ut, nil
}

func (uts *UserTypeService) DeleteByID(id int64) error {
	if err := db.TXHandler(uts.db, func(tx *sqlx.Tx) error {
		if _, err := uts.repo.Delete(tx, id); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return errors.Wrap(err, "failed delete")
	}
	return nil
}
