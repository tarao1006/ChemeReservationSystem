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
	facilityTypes := []model.FacilityType{}
	if err := db.Select(&facilityTypes, `SELECT id, name FROM facility_type ORDER BY id`); err != nil {
		return nil, err
	}
	return facilityTypes, nil
}

func (FacilityTypeRepository) FindByID(db *sqlx.DB, id int64) (*model.FacilityType, error) {
	var facilityType model.FacilityType
	if err := db.Get(&facilityType, `
		SELECT id, name FROM facility_type WHERE id = ?
	`, id); err != nil {
		return nil, err
	}
	return &facilityType, nil
}

func (FacilityTypeRepository) Create(db *sqlx.Tx, name string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO facility_type (name) VALUES (?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != err {
			err = closeErr
		}
	}()
	return stmt.Exec(name)
}

func (FacilityTypeRepository) Update(db *sqlx.Tx, id int64, param *model.FacilityType) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE facility_type SET name = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != err {
			err = closeErr
		}
	}()
	return stmt.Exec(param.Name, id)
}

func (FacilityTypeRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM facility_type WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != err {
			err = closeErr
		}
	}()
	return stmt.Exec(id)
}
