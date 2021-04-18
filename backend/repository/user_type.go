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

func (UserTypeRepository) Create(db *sqlx.Tx, ut *model.UserType) (result sql.Result, err error) {
	query := `INSERT INTO user_type (name) VALUES (?)`
	return db.Exec(query, ut.Name)
}

func (UserTypeRepository) Update(db *sqlx.Tx, id int64, param *model.UserType) (result sql.Result, err error) {
	query := `UPDATE user_type SET name = ? WHERE id = ?`
	return db.Exec(query, param.Name, id)
}

func (UserTypeRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	query := `DELETE FROM user_type WHERE id = ?`
	return db.Exec(query, id)
}
