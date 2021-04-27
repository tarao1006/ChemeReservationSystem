package service

import (
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type AuthService struct {
	db                    *sqlx.DB
	sessionRepo           *repository.SessionRepository
	rememberMeSessionRepo *repository.RememberMeSessionRepository
}

func NewAuthService() *AuthService {
	return &AuthService{
		db:                    db.GetDB(),
		sessionRepo:           repository.NewSessionRepository(),
		rememberMeSessionRepo: repository.NewRememberMeSessionRepository(),
	}
}

func (ss *AuthService) Delete(accessTokenID string, rememberMeTokenID string) error {
	if err := db.TXHandler(ss.db, func(tx *sqlx.Tx) error {
		if _, err := ss.sessionRepo.Delete(tx, accessTokenID); err != nil {
			return err
		}
		if _, err := ss.rememberMeSessionRepo.Delete(tx, rememberMeTokenID); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
