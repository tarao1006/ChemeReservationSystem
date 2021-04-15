package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type FacilityRepository struct {
	facilityTypeRepo *FacilityTypeRepository
}

func NewFacilityRepository() *FacilityRepository {
	return &FacilityRepository{
		facilityTypeRepo: NewFacilityTypeRepository(),
	}
}

func (fr *FacilityRepository) GetAll(db *sqlx.DB) ([]model.Facility, error) {
	facilities := []model.FacilityDTO{}
	if err := db.Select(&facilities, `SELECT id, name FROM facility ORDER BY id`); err != nil {
		return nil, err
	}

	res := []model.Facility{}
	for _, facility := range facilities {
		var types []model.FacilityType

		if err := db.Select(&types,
			`SELECT
				ft.id as id,
				ft.name as name
			FROM
				facility_group as fg
			INNER JOIN
				facility_type as ft
			ON
				fg.facility_type_id = ft.id
			WHERE
				fg.facility_id = ?;`, facility.ID); err != nil {
			return nil, err
		}
		res = append(res, model.Facility{
			ID:    facility.ID,
			Name:  facility.Name,
			Types: types,
		})
	}

	return res, nil
}

func (FacilityRepository) FindByID(db *sqlx.DB, id int64) (*model.Facility, error) {
	var facility model.FacilityDTO
	if err := db.Get(&facility, `
		SELECT id, name FROM facility WHERE id = ?
	`, id); err != nil {
		return nil, err
	}

	var types []model.FacilityType

	if err := db.Select(&types,
		`SELECT
			ft.id as id,
			ft.name as name
		FROM
			facility_group as fg
		INNER JOIN
			facility_type as ft
		ON
			fg.facility_type_id = ft.id
		WHERE
			fg.facility_id = ?
		ORDER BY
			ft.id;`, facility.ID); err != nil {
		return nil, err
	}

	return &model.Facility{
		ID:    facility.ID,
		Name:  facility.Name,
		Types: types,
	}, nil
}

func (FacilityRepository) Create(db *sqlx.Tx, param *model.FacilityDTO) (result sql.Result, err error) {
	query := `INSERT INTO facility (name) VALUES (?)`
	return db.Exec(query, param.Name)
}

func (FacilityRepository) UpdateNameByID(db *sqlx.Tx, id int64, name string) (result sql.Result, err error) {
	query := `UPDATE facility SET name = ? WHERE id = ?`
	return db.Exec(query, name, id)
}

func (FacilityRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	query := `DELETE FROM facility WHERE id = ?`
	return db.Exec(query, id)
}

func (FacilityRepository) AddGroup(db *sqlx.Tx, facilityID int64, facilityTypeID int64) (result sql.Result, err error) {
	query := `INSERT INTO facility_group (facility_id, facility_type_id) VALUES (?, ?)`
	return db.Exec(query, facilityID, facilityTypeID)
}

func (FacilityRepository) RemoveGroup(db *sqlx.Tx, facilityID int64, facilityTypeID int64) (result sql.Result, err error) {
	query := `DELETE FROM facility_group WHERE facility_id = ? AND facility_type_id = ?`
	return db.Exec(query, facilityID, facilityTypeID)
}

func (FacilityRepository) RemoveAllGroups(db *sqlx.Tx, facilityID int64) (result sql.Result, err error) {
	query := `DELETE FROM facility_group WHERE facility_id = ?`
	return db.Exec(query, facilityID)
}
