package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type FacilityTypeRepository struct{}

func NewFacilityTypeRepository() *FacilityTypeRepository {
	return &FacilityTypeRepository{}
}

func (FacilityTypeRepository) GetAll(db *sqlx.DB) ([]model.FacilityType, error) {
	var facilityTypes []model.FacilityType
	query := `SELECT id, name FROM facility_type ORDER BY id`
	if err := db.Select(&facilityTypes, query); err != nil {
		return nil, err
	}
	return facilityTypes, nil
}

func (FacilityTypeRepository) FindByID(db *sqlx.DB, id int64) (*model.FacilityType, error) {
	var facilityType model.FacilityType
	query := `SELECT id, name FROM facility_type WHERE id = ?`
	if err := db.Get(&facilityType, query, id); err != nil {
		return nil, err
	}
	return &facilityType, nil
}

func (FacilityTypeRepository) Create(db *sqlx.Tx, ft *model.FacilityType) (result sql.Result, err error) {
	query := `INSERT INTO facility_type (name) VALUES (?)`
	return db.Exec(query, ft.Name)
}

func (FacilityTypeRepository) Update(db *sqlx.Tx, id int64, name string) (result sql.Result, err error) {
	query := `UPDATE facility_type SET name = ? WHERE id = ?`
	return db.Exec(query, name, id)
}

func (FacilityTypeRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	query := `DELETE FROM facility_type WHERE id = ?`
	return db.Exec(query, id)
}
