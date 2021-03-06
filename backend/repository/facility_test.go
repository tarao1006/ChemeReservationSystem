package repository

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

func TestShouldGetAllFacilities(t *testing.T) {
	r := NewFacilityRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectQuery("^SELECT (.*) FROM facility as f INNER JOIN facility_group as fg ON fg.facility_id = f.id INNER JOIN facility_type as ft ON fg.facility_type_id = ft.id").WillReturnRows(sqlmock.NewRows([]string{"id", "name", "type_id", "type_name"}).AddRow(1, "new_facility", 1, "facility_type_name"))

	if _, err := r.GetAll(sqlxDB); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldGetFacilityByID(t *testing.T) {
	r := NewFacilityRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectQuery("^SELECT (.*) FROM facility as f INNER JOIN facility_group as fg ON fg.facility_id = f.id INNER JOIN facility_type as ft ON fg.facility_type_id = ft.id WHERE").WithArgs(1).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "new_facility_type"))

	_, err = r.FindByID(sqlxDB, 1)
	if err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldCreateFacility(t *testing.T) {
	r := NewFacilityRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO facility").WithArgs("facility_001").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	if err := db.TXHandler(sqlxDB, func(tx *sqlx.Tx) error {
		if _, err := r.Create(tx, &model.FacilityDTO{
			Name: "facility_001",
		}); err != nil {
			return err
		}
		return nil
	}); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
