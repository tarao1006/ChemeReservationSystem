package service

import (
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/auth"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	db   *sqlx.DB
	repo *repository.UserRepository
}

func NewAuthService() *AuthService {
	return &AuthService{
		db:   db.GetDB(),
		repo: repository.NewUserRepository(),
	}
}

func (as *AuthService) Login(auth *auth.Auth) error {
	user, err := as.repo.FindDTOByID(as.db, auth.ID)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordDigest), []byte(auth.Password)); err != nil {
		return err
	}

	return nil
}

func (as *AuthService) UpdateRememberMeToken(id string, t string) error {
	if err := db.TXHandler(as.db, func(tx *sqlx.Tx) error {
		_, err := as.repo.UpdateRememberMeToken(tx, id, t)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
