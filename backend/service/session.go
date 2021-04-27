package service

import (
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/auth"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/repository"
	"golang.org/x/crypto/bcrypt"
)

type SessionService struct {
	db       *sqlx.DB
	repo     *repository.SessionRepository
	userRepo *repository.UserRepository
}

func NewSessionService() *SessionService {
	return &SessionService{
		db:       db.GetDB(),
		repo:     repository.NewSessionRepository(),
		userRepo: repository.NewUserRepository(),
	}
}

func (ss *SessionService) Login(auth *auth.Auth) error {
	user, err := ss.userRepo.FindDTOByID(ss.db, auth.ID)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordDigest), []byte(auth.Password)); err != nil {
		return err
	}

	return nil
}

func (ss *SessionService) UpdateRememberMeToken(id string, t string) error {
	if err := db.TXHandler(ss.db, func(tx *sqlx.Tx) error {
		_, err := ss.userRepo.UpdateRememberMeToken(tx, id, t)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (ss *SessionService) GetUserIDByID(id string) (string, error) {
	return ss.repo.GetUserIDByID(ss.db, id)
}

func (ss *SessionService) Create(userID string, id string, expireAt time.Time) error {
	if err := db.TXHandler(ss.db, func(tx *sqlx.Tx) error {
		if _, err := ss.repo.Create(tx, id, userID, expireAt); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}