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
		SELECT id, name, name_ruby, password_digest, email_address, remember_digest FROM user WHERE id = ?
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

func (UserRepository) FindDTOByID(db *sqlx.DB, id string) (*model.UserDTO, error) {
	var user model.UserDTO
	if err := db.Get(&user, `
		SELECT id, name, name_ruby, password_digest, email_address, remember_digest FROM user WHERE id = ?
	`, id); err != nil {
		return nil, err
	}

	return &user, nil
}

func (UserRepository) FindDTOByEmailAddress(db *sqlx.DB, e string) (*model.UserDTO, error) {
	var user model.UserDTO
	if err := db.Get(&user, `
		SELECT id, name, name_ruby, password_digest, email_address, remember_digest FROM user WHERE email_address = ?
	`, e); err != nil {
		return nil, err
	}

	return &user, nil
}

func (UserRepository) CountUser(db *sqlx.DB, id string) (int, error) {
	var c int
	if err := db.Get(&c, `
		SELECT COUNT(*) FROM user WHERE id = ?
	`, id); err != nil {
		return 0, err
	}

	return c, nil
}

func (UserRepository) Create(db *sqlx.Tx, param *model.UserDTO) (result sql.Result, err error) {
	query := `INSERT INTO user (id, name, name_ruby, password_digest, email_address) VALUES (?, ?, ?, ?, ?)`
	return db.Exec(query, param.ID, param.Name, param.NameRuby, param.PasswordDigest, param.EmailAddress)
}

func (UserRepository) UpdateRememberDigest(db *sqlx.Tx, id string, d []byte) (result sql.Result, err error) {
	query := `UPDATE user SET remember_digest = ? WHERE id = ?`
	return db.Exec(query, d, id)
}

func (UserRepository) UpdateNameByID(db *sqlx.Tx, id string, n string) (result sql.Result, err error) {
	query := `UPDATE user SET name = ? WHERE id = ?`
	return db.Exec(query, n, id)
}

func (UserRepository) UpdateNameRubyByID(db *sqlx.Tx, id string, n string) (result sql.Result, err error) {
	query := `UPDATE user SET name_ruby = ? WHERE id = ?`
	return db.Exec(query, n, id)
}

func (UserRepository) UpdateEmailAddressByID(db *sqlx.Tx, id string, e string) (result sql.Result, err error) {
	query := `UPDATE user SET email_address = ? WHERE id = ?`
	return db.Exec(query, e, id)
}

func (UserRepository) UpdatePasswordDigestByID(db *sqlx.Tx, id string, p []byte) (result sql.Result, err error) {
	query := `UPDATE user SET password_digest = ? WHERE id = ?`
	return db.Exec(query, p, id)
}

func (UserRepository) Delete(db *sqlx.Tx, id string) (result sql.Result, err error) {
	query := `DELETE FROM user WHERE id = ?`
	return db.Exec(query, id)
}

func (UserRepository) AddGroup(db *sqlx.Tx, userID string, userTypeID int64) (result sql.Result, err error) {
	query := `INSERT INTO user_group (user_id, user_type_id) VALUES (?, ?)`
	return db.Exec(query, userID, userTypeID)
}

func (UserRepository) RemoveGroup(db *sqlx.Tx, userID string, userTypeID int64) (result sql.Result, err error) {
	query := `DELETE FROM user_group WHERE user_id = ? AND user_type_id = ?`
	return db.Exec(query, userID, userTypeID)
}

func (UserRepository) RemoveAllGroups(db *sqlx.Tx, userID string) (result sql.Result, err error) {
	query := `DELETE FROM user_group WHERE user_id = ?`
	return db.Exec(query, userID)
}
