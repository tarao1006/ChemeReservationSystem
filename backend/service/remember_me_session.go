package service

import (
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type RememberMeSessionService struct {
	db   *sqlx.DB
	repo *repository.RememberMeSessionRepository
}

func NewRememberMeSessionService() *RememberMeSessionService {
	return &RememberMeSessionService{
		db:   db.GetDB(),
		repo: repository.NewRememberMeSessionRepository(),
	}
}

func (rs *RememberMeSessionService) CreateOrUpdate(userID string, id string, expireAt time.Time) error {
	if err := db.TXHandler(rs.db, func(tx *sqlx.Tx) error {
		_, err := rs.repo.Create(tx, id, userID, expireAt)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
