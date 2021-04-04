package service

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	db   *sqlx.DB
	repo *repository.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		db:   db.GetDB(),
		repo: repository.NewUserRepository(),
	}
}

func (us *UserService) GetAll() ([]model.User, error) {
	return us.repo.GetAll(us.db)
}

func (us *UserService) GetByID(id string) (*model.User, error) {
	return us.repo.FindByID(us.db, id)
}

func (us *UserService) Create(c *gin.Context) (*model.User, error) {
	var u model.UserAPI
	if err := c.BindJSON(&u); err != nil {
		return nil, err
	}

	fmt.Println(u)

	hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), 10)
	if err != nil {
		return nil, err
	}

	if err := db.TXHandler(us.db, func(tx *sqlx.Tx) error {
		var err error
		_, err = us.repo.Create(tx, &model.UserDTO{
			ID:             u.ID,
			Name:           u.Name,
			NameRuby:       u.NameRuby,
			PasswordDigest: hashed,
			EmailAddress:   u.EmailAddress,
		})
		if err != nil {
			return err
		}

		for _, ut := range u.Types {
			_, err = us.repo.AddGroup(tx, u.ID, ut.ID)
			if err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return &model.User{
		ID:           u.ID,
		Name:         u.Name,
		NameRuby:     u.NameRuby,
		EmailAddress: u.EmailAddress,
		Types:        u.Types,
	}, nil
}

func (us *UserService) DeleteByID(id string) error {
	if err := db.TXHandler(us.db, func(tx *sqlx.Tx) error {
		var err error
		_, err = us.repo.RemoveGroup(tx, id)
		if err != nil {
			return err
		}
		_, err = us.repo.Delete(tx, id)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
