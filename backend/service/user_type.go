package service

import (
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

func (uts *UserTypeService) Create(ut *model.UserType) (*model.UserType, error) {
	if err := db.TXHandler(uts.db, func(tx *sqlx.Tx) error {
		res, err := uts.repo.Create(tx, ut)
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
	return ut, nil
}

func (uts *UserTypeService) UpdateByID(id int64, ut *model.UserType) (*model.UserType, error) {
	if err := db.TXHandler(uts.db, func(tx *sqlx.Tx) error {
		if _, err := uts.repo.Update(tx, id, ut); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, errors.Wrap(err, "failed update")
	}

	newUt, err := uts.repo.FindByID(uts.db, id)
	if err != nil {
		return nil, err
	}

	return newUt, nil
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
