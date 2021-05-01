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
		"user_id",
		"facility_id",
	}).AddRow(
		1,
		"test001",
		stringToTime("2021-04-04 10:00:00"),
		stringToTime("2021-04-04 11:00:00"),
		2,
		"",
		stringToTime("2021-04-16 00:28:44"),
		stringToTime("2021-04-16 00:28:44"),
		"user001",
		1,
	)

	mock.ExpectQuery(`
		^SELECT
			(.+)
		FROM
			reservation as r
		INNER JOIN
			reservation_user as ru
		ON
			r.id = ru.reservation_id
		INNER JOIN
			reservation_facility as rf
		ON
			r.id = rf.reservation_id
	`).WillReturnRows(reservationRows)

	mock.ExpectQuery(`
		^SELECT
			(.*)
		FROM
			user as u
		INNER JOIN
			user_group as ug
		ON
			ug.user_id = u.id
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
		"name_ruby",
		"password_digest",
		"email_address",
		"type_id",
		"type_name",
	}).AddRow(
		"user_001",
		"user_001",
		"user_001",
		"password",
		"test@test.com",
		1,
		"user_type_name",
	))

	mock.ExpectQuery(`
		^SELECT
			(.+)
		FROM
			plan
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
	}).AddRow(
		1,
		"plan001",
	))

	mock.ExpectQuery(`
		^SELECT
			(.+)
		FROM
			user as u
		INNER JOIN
			user_group as ug
		ON
			ug.user_id = u.id
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
		WHERE
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
		"name_ruby",
		"password_digest",
		"email_address",
		"type_id",
		"type_name",
	}).AddRow(
		"user_001",
		"user_001",
		"user_001",
		"password",
		"test@test.com",
		1,
		"user_type_name",
	))

	mock.ExpectQuery(`
		^SELECT
			(.+)
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
		WHERE
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
		"type_id",
		"type_name",
	}).AddRow(
		1,
		"new_facility",
		1,
		"facility_type_name",
	))

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
		"user_id",
		"facility_id",
	}).AddRow(
		1,
		"test001",
		stringToTime("2021-04-04 10:00:00"),
		stringToTime("2021-04-04 11:00:00"),
		2,
		"",
		stringToTime("2021-04-16 00:28:44"),
		stringToTime("2021-04-16 00:28:44"),
		"user001",
		1,
	)

	mock.ExpectQuery(`
		^SELECT
			(.+)
		FROM
			reservation as r
		INNER JOIN
			reservation_user as ru
		ON
			r.id = ru.reservation_id
		INNER JOIN
			reservation_facility as rf
		ON
			r.id = rf.reservation_id
	`).WillReturnRows(reservationRows)

	mock.ExpectQuery(`
		^SELECT
			(.*)
		FROM
			user as u
		INNER JOIN
			user_group as ug
		ON
			ug.user_id = u.id
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
		"name_ruby",
		"password_digest",
		"email_address",
		"type_id",
		"type_name",
	}).AddRow(
		"user_001",
		"user_001",
		"user_001",
		"password",
		"test@test.com",
		1,
		"user_type_name",
	))

	mock.ExpectQuery(`
		^SELECT
			(.+)
		FROM
			plan
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
	}).AddRow(
		1,
		"plan001",
	))

	mock.ExpectQuery(`
		^SELECT
			(.+)
		FROM
			user as u
		INNER JOIN
			user_group as ug
		ON
			ug.user_id = u.id
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
		WHERE
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
		"name_ruby",
		"password_digest",
		"email_address",
		"type_id",
		"type_name",
	}).AddRow(
		"user_001",
		"user_001",
		"user_001",
		"password",
		"test@test.com",
		1,
		"user_type_name",
	))

	mock.ExpectQuery(`
		^SELECT
			(.+)
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
		WHERE
	`).WillReturnRows(sqlmock.NewRows([]string{
		"id",
		"name",
		"type_id",
		"type_name",
	}).AddRow(
		1,
		"new_facility",
		1,
		"facility_type_name",
	))

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

	if err := db.TXHandler(sqlxDB, func(tx *sqlx.Tx) error {
		if _, err := r.Create(tx, &model.ReservationDTO{
			CreatorID: "user001",
			StartAt:   stringToTime("2021-04-04 10:00:00"),
			EndAt:     stringToTime("2021-04-04 11:00:00"),
			PlanID:    1,
			PlanMemo:  "",
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
