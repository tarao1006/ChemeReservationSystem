package repository

import (
	"fmt"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
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

func TestGetFacilityTypesByIDs(t *testing.T) {
	r := NewFacilityTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()
	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "new_facility_type_1").
		AddRow(2, "new_facility_type_2")

	mock.ExpectQuery("SELECT (.*) FROM facility_type WHERE id in (?)").WithArgs([]int64{1, 2}).WillReturnRows(rows)

	fts, err := r.FindByIDs(sqlxDB, []int64{1, 2})
	fmt.Println(fts)
	if err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
