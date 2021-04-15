package repository

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
)

func TestGetAllFacilityTypes(t *testing.T) {
	r := NewFacilityTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "new_facility_type")

	mock.ExpectQuery("SELECT (.*) FROM facility_type").WillReturnRows(rows)

	if _, err := r.GetAll(sqlxDB); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetFacilityTypeByID(t *testing.T) {
	r := NewFacilityTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "new_facility_type")

	mock.ExpectQuery("SELECT (.*) FROM facility_type WHERE id = ?").WithArgs(1).WillReturnRows(rows)

	_, err = r.FindByID(sqlxDB, 1)
	if err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldCreateFacilityType(t *testing.T) {
	r := NewFacilityTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO facility_type").WithArgs("facility_type_001").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	if err := db.TXHandler(sqlxDB, func(tx *sqlx.Tx) error {
		if _, err := r.Create(tx, "facility_type_001"); err != nil {
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
