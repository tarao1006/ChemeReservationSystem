package service

import (
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type SessionService struct {
	db   *sqlx.DB
	repo *repository.SessionRepository
}

func NewSessionService() *SessionService {
	return &SessionService{
		db:   db.GetDB(),
		repo: repository.NewSessionRepository(),
	}
}

func (ss *SessionService) GetUserIDByID(id string) (string, error) {
	return ss.repo.GetUserIDByID(ss.db, id)
}

func (ss *SessionService) Create(userID string, id string) error {
	if err := db.TXHandler(ss.db, func(tx *sqlx.Tx) error {
		if _, err := ss.repo.Create(tx, id, userID); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
