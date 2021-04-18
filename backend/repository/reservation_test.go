package repository

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

var layout = "2006-01-02 15:04:05"

func stringToTime(str string) time.Time {
	t, _ := time.Parse(layout, str)
	return t
}

func TestShouldGetAllReservations(t *testing.T) {
	r := NewReservationRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	reservationRows := sqlmock.NewRows([]string{
		"id",
		"creator_id",
		"start_at",
		"end_at",
		"plan_id",
		"plan_memo",
		"created_at",
		"updated_at",
	}).AddRow(
		1,
		"test001",
		stringToTime("2021-04-04 10:00:00"),
		stringToTime("2021-04-04 11:00:00"),
		2,
		"",
		stringToTime("2021-04-16 00:28:44"),
		stringToTime("2021-04-16 00:28:44"),
	)
	userIDRows := sqlmock.NewRows([]string{"user_id"}).AddRow("test001").AddRow("test002")
	facilityIDRows := sqlmock.NewRows([]string{"facility_id"}).AddRow(1).AddRow(2)

	mock.ExpectQuery("^SELECT (.+) FROM reservation").WillReturnRows(reservationRows)

	mock.ExpectQuery("^SELECT (.+) FROM user").WithArgs("test001").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "test001"))
	mock.ExpectQuery("^SELECT (.+) as name FROM user_group as ug INNER JOIN user_type as ut (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	mock.ExpectQuery("^SELECT (.+) FROM plan").WithArgs(2).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "plan001"))
	mock.ExpectQuery("^SELECT (.+) FROM reservation_user").WithArgs(1).WillReturnRows(userIDRows)

	mock.ExpectQuery("^SELECT (.+) FROM user").WithArgs("test001").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "test001"))
	mock.ExpectQuery("^SELECT (.+) FROM user_group as ug INNER JOIN user_type as ut (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))
	mock.ExpectQuery("^SELECT (.+) FROM user").WithArgs("test002").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "test002"))
	mock.ExpectQuery("^SELECT (.+) FROM user_group as ug INNER JOIN user_type as ut (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	mock.ExpectQuery("^SELECT (.+) FROM reservation_facility").WithArgs(1).WillReturnRows(facilityIDRows)

	mock.ExpectQuery("^SELECT (.+) FROM facility").WithArgs(1).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "facility001"))
	mock.ExpectQuery("^SELECT (.+) FROM facility_group as fg INNER JOIN facility_type as ft (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))
	mock.ExpectQuery("^SELECT (.+) FROM facility").WithArgs(2).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(2, "facility001"))
	mock.ExpectQuery("^SELECT (.+) FROM facility_group as fg INNER JOIN facility_type as ft (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	if _, err := r.GetAll(sqlxDB); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldGetReservationByID(t *testing.T) {
	r := NewReservationRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	reservationRows := sqlmock.NewRows([]string{
		"id",
		"creator_id",
		"start_at",
		"end_at",
		"plan_id",
		"plan_memo",
		"created_at",
		"updated_at",
	}).AddRow(
		1,
		"test001",
		stringToTime("2021-04-04 10:00:00"),
		stringToTime("2021-04-04 11:00:00"),
		2,
		"",
		stringToTime("2021-04-16 00:28:44"),
		stringToTime("2021-04-16 00:28:44"),
	)
	userIDRows := sqlmock.NewRows([]string{"user_id"}).AddRow("test001").AddRow("test002")
	facilityIDRows := sqlmock.NewRows([]string{"facility_id"}).AddRow(1).AddRow(2)

	mock.ExpectQuery("^SELECT (.+) FROM reservation").WithArgs(1).WillReturnRows(reservationRows)

	mock.ExpectQuery("^SELECT (.+) FROM user").WithArgs("test001").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "test001"))
	mock.ExpectQuery("^SELECT ut.id as id, ut.name as name FROM user_group as ug INNER JOIN user_type as ut (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	mock.ExpectQuery("^SELECT (.+) FROM plan").WithArgs(2).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "plan001"))
	mock.ExpectQuery("^SELECT (.+) FROM reservation_user").WithArgs(1).WillReturnRows(userIDRows)

	mock.ExpectQuery("^SELECT (.+) FROM user").WithArgs("test001").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "test001"))
	mock.ExpectQuery("^SELECT (.+) FROM user_group as ug INNER JOIN user_type as ut (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))
	mock.ExpectQuery("^SELECT (.+) FROM user").WithArgs("test002").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "test002"))
	mock.ExpectQuery("^SELECT (.+) FROM user_group as ug INNER JOIN user_type as ut (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	mock.ExpectQuery("^SELECT (.+) FROM reservation_facility").WithArgs(1).WillReturnRows(facilityIDRows)

	mock.ExpectQuery("^SELECT (.+) FROM facility").WithArgs(1).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "facility001"))
	mock.ExpectQuery("^SELECT (.+) FROM facility_group as fg INNER JOIN facility_type as ft (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))
	mock.ExpectQuery("^SELECT (.+) FROM facility").WithArgs(2).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).AddRow(2, "facility001"))
	mock.ExpectQuery("^SELECT (.+) FROM facility_group as fg INNER JOIN facility_type as ft (.+)").WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	if _, err := r.FindByID(sqlxDB, 1); err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldCreateReservation(t *testing.T) {
	r := NewReservationRepository()
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")

	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO reservation").WithArgs("user001", stringToTime("2021-04-04 10:00:00"), stringToTime("2021-04-04 11:00:00"), 1, "").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	dto := model.ReservationDTO{
		CreatorID: "user001",
		StartAt:   stringToTime("2021-04-04 10:00:00"),
		EndAt:     stringToTime("2021-04-04 11:00:00"),
		PlanID:    1,
		PlanMemo:  "",
	}

	if err := db.TXHandler(sqlxDB, func(tx *sqlx.Tx) error {
		if _, err := r.Create(tx, &dto); err != nil {
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
