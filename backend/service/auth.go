package service

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
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

func (as *AuthService) Login(c *gin.Context) (*model.UserDTO, error) {
	var auth model.Auth
	if err := c.BindJSON(&auth); err != nil {
		return nil, err
	}

	user, err := as.repo.FindDTOByEmailAddress(as.db, auth.EmailAddress)
	if err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordDigest), []byte(auth.Password)); err != nil {
		return nil, err
	}

	return user, nil
}
