package service

import (
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

func (us *UserService) Create(u *model.UserAPI) (*model.User, error) {
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
			_, err = us.repo.AddGroup(tx, u.ID, ut)
			if err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	newU, err := us.repo.FindByID(us.db, u.ID)
	if err != nil {
		return nil, err
	}

	return newU, nil
}

func (us *UserService) UpdateByID(id string, u *model.UserAPI) (*model.User, error) {
	user, err := us.repo.FindByID(us.db, id)
	if err != nil {
		return nil, err
	}

	if err := db.TXHandler(us.db, func(tx *sqlx.Tx) error {
		var err error
		if u.Name != "" {
			_, err = us.repo.UpdateNameByID(tx, id, u.Name)
			if err != nil {
				return err
			}
		}
		if u.NameRuby != "" {
			_, err = us.repo.UpdateNameRubyByID(tx, id, u.NameRuby)
			if err != nil {
				return err
			}
		}
		if u.EmailAddress != "" {
			_, err = us.repo.UpdateEmailAddressByID(tx, id, u.EmailAddress)
			if err != nil {
				return err
			}
		}
		if u.Password != "" {
			hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), 10)
			if err != nil {
				return err
			}
			_, err = us.repo.UpdatePasswordDigestByID(tx, id, hashed)
			if err != nil {
				return err
			}
		}
		if len(u.Types) != 0 {
			for _, userType := range user.Types {
				_, err = us.repo.RemoveGroup(tx, id, userType.ID)
				if err != nil {
					return err
				}
			}
			for _, userType := range u.Types {
				_, err = us.repo.AddGroup(tx, id, userType)
				if err != nil {
					return err
				}
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	newU, err := us.repo.FindByID(us.db, id)
	if err != nil {
		return nil, err
	}
	return newU, nil
}

func (us *UserService) UpdatePasswordByID(id string, p *model.Password) (*model.User, error) {
	if p.OldPassword == p.NewPassword {
		return nil, model.ErrNewPasswordMustBeChanged
	}

	user, err := us.repo.FindDTOByID(us.db, id)
	if err != nil {
		return nil, err
	}

	newHashed, err := bcrypt.GenerateFromPassword([]byte(p.NewPassword), 10)
	if err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword(user.PasswordDigest, []byte(p.OldPassword)); err != nil {
		return nil, err
	}

	if err := db.TXHandler(us.db, func(tx *sqlx.Tx) error {
		_, err := us.repo.UpdatePasswordDigestByID(tx, id, newHashed)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, err
	}

	newUser, err := us.repo.FindByID(us.db, id)
	if err != nil {
		return nil, err
	}
	return newUser, nil
}

func (us *UserService) DeleteByID(id string) error {
	if err := db.TXHandler(us.db, func(tx *sqlx.Tx) error {
		var err error
		_, err = us.repo.RemoveAllGroups(tx, id)
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
