package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type UserTypeRepository struct{}

func NewUserTypeRepository() *UserTypeRepository {
	return &UserTypeRepository{}
}

func (UserTypeRepository) GetAll(db *sqlx.DB) ([]model.UserType, error) {
	userTypes := []model.UserType{}
	if err := db.Select(&userTypes, `SELECT id, name FROM user_type ORDER BY id`); err != nil {
		return nil, err
	}
	return userTypes, nil
}

func (UserTypeRepository) FindByID(db *sqlx.DB, id int64) (*model.UserType, error) {
	var userType model.UserType
	if err := db.Get(&userType, `
		SELECT id, name FROM user_type WHERE id = ?
	`, id); err != nil {
		return nil, err
	}
	return &userType, nil
}

func (UserTypeRepository) Create(db *sqlx.Tx, name string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO user_type (name) VALUES (?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(name)
}

func (UserTypeRepository) Update(db *sqlx.Tx, id int64, param *model.UserType) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE user_type SET name = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(param.Name, id)
}

func (UserTypeRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM user_type WHERE id = ?`)
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
