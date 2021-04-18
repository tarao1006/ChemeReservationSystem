package repository

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

func TestShouldGetAllUsers(t *testing.T) {
	r := NewUserRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectQuery("^SELECT (.*) FROM user").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "new_facility"))
	mock.ExpectQuery("^SELECT ut.id as id, ut.name as name FROM user_group as ug INNER JOIN user_type as ut ON ug.user_type_id = ut.id WHERE").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	if _, err := r.GetAll(sqlxDB); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldGetUserByID(t *testing.T) {
	r := NewUserRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectQuery("^SELECT (.*) FROM user WHERE id = ?").WithArgs("user_001").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow("user_001", "user_001"))
	mock.ExpectQuery("^SELECT ut.id as id, ut.name as name FROM user_group as ug INNER JOIN user_type as ut ON ug.user_type_id = ut.id WHERE").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	_, err = r.FindByID(sqlxDB, "user_001")
	if err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
func TestShouldCreateUser(t *testing.T) {
	r := NewUserRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO user").WithArgs("user_001", "user_001", "user_001", []byte("password"), "test@test.com").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	if err := db.TXHandler(sqlxDB, func(tx *sqlx.Tx) error {
		if _, err := r.Create(tx, &model.UserDTO{
			ID:             "user_001",
			Name:           "user_001",
			NameRuby:       "user_001",
			PasswordDigest: []byte("password"),
			EmailAddress:   "test@test.com",
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
