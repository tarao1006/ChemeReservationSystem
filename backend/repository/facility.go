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
	facilities := []model.FacilityDTOWithType{}
	if err := db.Select(&facilities, `
		SELECT
			f.id, f.name, ft.id as type_id, ft.name as type_name
		FROM
			facility as f
		INNER JOIN
			facility_group as fg
		ON
			fg.facility_id = f.id
		INNER JOIN
			facility_type as ft
		ON
			fg.facility_type_id = ft.id
		ORDER BY id`); err != nil {
		return nil, err
	}

	res := []model.Facility{}

	userIDs := []int64{}
	mapTypes := map[int64][]model.FacilityType{}
	mapFacility := map[int64]*model.Facility{}

	for _, facility := range facilities {
		mapTypes[facility.ID] = append(mapTypes[facility.ID], model.FacilityType{
			ID:   facility.TypeID,
			Name: facility.TypeName,
		})
		if _, ok := mapFacility[facility.ID]; !ok {
			userIDs = append(userIDs, facility.ID)
			mapFacility[facility.ID] = &model.Facility{
				ID:    facility.ID,
				Name:  facility.Name,
				Types: []model.FacilityType{},
			}
		}
	}

	for _, id := range userIDs {
		mapFacility[id].Types = mapTypes[id]
	}

	for _, v := range mapFacility {
		res = append(res, *v)
	}

	return res, nil
}

func (FacilityRepository) FindByID(db *sqlx.DB, id int64) (*model.Facility, error) {
	facilities := []model.FacilityDTOWithType{}
	if err := db.Select(&facilities, `
		SELECT
			f.id, f.name, ft.id as type_id, ft.name as type_name
		FROM
			facility as f
		INNER JOIN
			facility_group as fg
		ON
			fg.facility_id = f.id
		INNER JOIN
			facility_type as ft
		ON
			fg.facility_type_id = ft.id
		WHERE f.id = ?
	`, id); err != nil {
		return nil, err
	}

	types := []model.FacilityType{}
	for _, facility := range facilities {
		types = append(types, model.FacilityType{
			ID:   facility.TypeID,
			Name: facility.TypeName,
		})
	}

	return &model.Facility{
		ID:    facilities[0].ID,
		Name:  facilities[0].Name,
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
