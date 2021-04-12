package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (ur *UserRepository) GetAll(db *sqlx.DB) ([]model.User, error) {
	users := []model.UserDTO{}
	if err := db.Select(&users, `SELECT id, name, name_ruby, password_digest, email_address FROM user ORDER BY id`); err != nil {
		return nil, err
	}

	res := []model.User{}
	for _, user := range users {
		var types []model.UserType
		if err := db.Select(&types,
			`SELECT
				ut.id as id,
				ut.name as name
			FROM
				user_group as ug
			INNER JOIN
				user_type as ut
			ON
				ug.user_type_id = ut.id
			WHERE
				ug.user_id = ?;`, user.ID); err != nil {
			return nil, err
		}
		res = append(res, model.User{
			ID:           user.ID,
			Name:         user.Name,
			NameRuby:     user.NameRuby,
			EmailAddress: user.EmailAddress,
			Types:        types,
		})
	}

	return res, nil
}

func (UserRepository) FindByID(db *sqlx.DB, id string) (*model.User, error) {
	var user model.UserDTO
	if err := db.Get(&user, `
		SELECT id, name, name_ruby, password_digest, email_address FROM user WHERE id = ?
	`, id); err != nil {
		return nil, err
	}

	var types []model.UserType
	if err := db.Select(&types,
		`SELECT
			ut.id as id,
			ut.name as name
		FROM
			user_group as ug
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
		WHERE
			ug.user_id = ?
		ORDER BY
			ut.id;`, user.ID); err != nil {
		return nil, err
	}

	return &model.User{
		ID:           user.ID,
		Name:         user.Name,
		NameRuby:     user.NameRuby,
		EmailAddress: user.EmailAddress,
		Types:        types,
	}, nil
}

func (UserRepository) FindByEmailAddress(db *sqlx.DB, email_address string) (*model.UserDTO, error) {
	var user model.UserDTO
	if err := db.Get(&user, `
		SELECT id, name, name_ruby, password_digest, email_address FROM user WHERE email_address = ?
	`, email_address); err != nil {
		return nil, err
	}

	return &user, nil
}

func (UserRepository) Create(db *sqlx.Tx, param *model.UserDTO) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO user (id, name, name_ruby, password_digest, email_address) VALUES (?, ?, ?, ?, ?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(param.ID, param.Name, param.NameRuby, param.PasswordDigest, param.EmailAddress)
}

func (UserRepository) UpdateNameByID(db *sqlx.Tx, id string, name string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE user SET name = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(name, id)
}

func (UserRepository) UpdateNameRubyByID(db *sqlx.Tx, id string, nameRuby string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE user SET name_ruby = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(nameRuby, id)
}

func (UserRepository) UpdateEmailAddressByID(db *sqlx.Tx, id string, email_address string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE user SET email_address = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(email_address, id)
}

func (UserRepository) UpdatePasswordDigestByID(db *sqlx.Tx, id string, password_digest []byte) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE user SET password_digest = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(password_digest, id)
}

func (UserRepository) Delete(db *sqlx.Tx, id string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM user WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(id)
}

func (UserRepository) AddGroup(db *sqlx.Tx, user_id string, user_type_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO user_group (user_id, user_type_id) VALUES (?, ?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(user_id, user_type_id)
}

func (UserRepository) RemoveGroup(db *sqlx.Tx, user_id string, user_type_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM user_group WHERE user_id = ? AND user_type_id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(user_id, user_type_id)
}

func (UserRepository) RemoveAllGroups(db *sqlx.Tx, user_id string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM user_group WHERE user_id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(user_id)
}
