package repository

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
)

func TestShouldGetAllUserTypes(t *testing.T) {
	r := NewUserTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "new_user_type")

	mock.ExpectQuery("SELECT (.*) FROM user_type").WillReturnRows(rows)

	if _, err := r.GetAll(sqlxDB); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldGetUserTypeByID(t *testing.T) {
	r := NewUserTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "new_user_type")

	mock.ExpectQuery("SELECT (.*) FROM user_type WHERE id = ?").WithArgs(1).WillReturnRows(rows)

	_, err = r.FindByID(sqlxDB, 1)
	if err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldCreateUserType(t *testing.T) {
	r := NewUserTypeRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO user_type").WithArgs("user_type_001").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	if err := db.TXHandler(sqlxDB, func(tx *sqlx.Tx) error {
		if _, err := r.Create(tx, "user_type_001"); err != nil {
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
