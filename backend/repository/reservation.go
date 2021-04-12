package repository

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type ReservationRepository struct{}

func NewReservationRepository() *ReservationRepository {
	return &ReservationRepository{}
}

func (ur *ReservationRepository) GetAll(db *sqlx.DB) ([]model.Reservation, error) {
	reservations := []model.ReservationDTO{}
	if err := db.Select(&reservations, `SELECT id, creator_id, start_at, end_at, plan_id, plan_memo, created_at, updated_at FROM reservation ORDER BY id`); err != nil {
		return nil, err
	}

	res := []model.Reservation{}
	userRepo := NewUserRepository()
	planRepo := NewPlanRepository()
	facilityRepo := NewFacilityRepository()
	for _, reservation := range reservations {
		var (
			err         error
			creator     *model.User
			plan        *model.Plan
			userIDs     []string
			facilityIDs []int64
			users       []model.User
			facilities  []model.Facility
		)

		creator, err = userRepo.FindByID(db, reservation.CreatorID)
		if err != nil {
			return nil, err
		}

		plan, err = planRepo.FindByID(db, reservation.PlanID)
		if err != nil {
			return nil, err
		}

		if err = db.Select(&userIDs,
			`SELECT
				user_id
			FROM
				reservation_user
			WHERE
				reservation_id = ?;`, reservation.ID); err != nil {
			return nil, err
		}
		for _, id := range userIDs {
			user, err := userRepo.FindByID(db, id)
			if err != nil {
				return nil, err
			}
			users = append(users, *user)
		}

		if err = db.Select(&facilityIDs,
			`SELECT
				facility_id
			FROM
				reservation_facility
			WHERE
				reservation_id = ?;`, reservation.ID); err != nil {
			return nil, err
		}
		for _, id := range facilityIDs {
			facility, err := facilityRepo.FindByID(db, id)
			if err != nil {
				return nil, err
			}
			facilities = append(facilities, *facility)
		}

		res = append(res, model.Reservation{
			ID:         reservation.ID,
			Creator:    *creator,
			StartAt:    reservation.StartAt,
			EndAt:      reservation.EndAt,
			Plan:       *plan,
			PlanMemo:   reservation.PlanMemo,
			CreatedAt:  reservation.CreatedAt,
			UpdatedAt:  reservation.UpdatedAt,
			Attendees:  users,
			Facilities: facilities,
		})
	}
	return res, nil
}

func (ReservationRepository) FindByID(db *sqlx.DB, id int64) (*model.Reservation, error) {
	var reservation model.ReservationDTO
	if err := db.Get(&reservation, `
		SELECT id, creator_id, start_at, end_at, plan_id, plan_memo, created_at, updated_at FROM reservation WHERE id = ?
	`, id); err != nil {
		return nil, err
	}

	userRepo := NewUserRepository()
	planRepo := NewPlanRepository()
	facilityRepo := NewFacilityRepository()
	var (
		err         error
		creator     *model.User
		plan        *model.Plan
		userIDs     []string
		facilityIDs []int64
		users       []model.User
		facilities  []model.Facility
	)

	creator, err = userRepo.FindByID(db, reservation.CreatorID)
	if err != nil {
		return nil, err
	}

	plan, err = planRepo.FindByID(db, reservation.PlanID)
	if err != nil {
		return nil, err
	}

	if err = db.Select(&userIDs,
		`SELECT
			user_id
		FROM
			reservation_user
		WHERE
			reservation_id = ?;`, reservation.ID); err != nil {
		return nil, err
	}
	for _, id := range userIDs {
		user, err := userRepo.FindByID(db, id)
		if err != nil {
			return nil, err
		}
		users = append(users, *user)
	}

	if err := db.Select(&facilityIDs,
		`SELECT
			facility_id
		FROM
			reservation_facility
		WHERE
			reservation_id = ?;`, reservation.ID); err != nil {
		return nil, err
	}
	for _, id := range facilityIDs {
		facility, err := facilityRepo.FindByID(db, id)
		if err != nil {
			return nil, err
		}
		facilities = append(facilities, *facility)
	}

	return &model.Reservation{
		ID:         reservation.ID,
		Creator:    *creator,
		StartAt:    reservation.StartAt,
		EndAt:      reservation.EndAt,
		Plan:       *plan,
		PlanMemo:   reservation.PlanMemo,
		CreatedAt:  reservation.CreatedAt,
		UpdatedAt:  reservation.UpdatedAt,
		Attendees:  users,
		Facilities: facilities,
	}, nil
}

func (ReservationRepository) Create(db *sqlx.Tx, param *model.ReservationDTO) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO reservation (creator_id, start_at, end_at, plan_id, plan_memo) VALUES (?, ?, ?, ?, ?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(param.CreatorID, param.StartAt, param.EndAt, param.PlanID, param.PlanMemo)
}

func (ReservationRepository) UpdateStartAtByID(db *sqlx.Tx, id int64, start_at time.Time) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE reservation SET start_at = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(start_at, id)
}

func (ReservationRepository) UpdateEndAtByID(db *sqlx.Tx, id int64, end_at time.Time) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE reservation SET end_at = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(end_at, id)
}

func (ReservationRepository) UpdatePlanIDByID(db *sqlx.Tx, id int64, plan_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE reservation SET plan_id = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(plan_id, id)
}

func (ReservationRepository) UpdatePlanMemoByID(db *sqlx.Tx, id int64, plan_memo string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`UPDATE reservation SET plan_memo = ? WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(plan_memo, id)
}

func (ReservationRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM reservation WHERE id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(id)
}

func (ReservationRepository) AddUser(db *sqlx.Tx, reservation_id int64, user_id string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO reservation_user (reservation_id, user_id) VALUES (?, ?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(reservation_id, user_id)
}

func (ReservationRepository) RemoveUser(db *sqlx.Tx, reservation_id int64, user_id string) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM reservation_user WHERE reservation_id = ? AND user_id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(reservation_id, user_id)
}

func (ReservationRepository) RemoveAllUsers(db *sqlx.Tx, reservation_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM reservation_user WHERE reservation_id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(reservation_id)
}

func (ReservationRepository) AddFacility(db *sqlx.Tx, reservation_id int64, facility_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`INSERT INTO reservation_facility (reservation_id, facility_id) VALUES (?, ?)`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(reservation_id, facility_id)
}

func (ReservationRepository) RemoveFacility(db *sqlx.Tx, reservation_id int64, facility_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM reservation_facility WHERE reservation_id = ? AND facility_id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(reservation_id, facility_id)
}

func (ReservationRepository) RemoveAllFacilities(db *sqlx.Tx, reservation_id int64) (result sql.Result, err error) {
	stmt, err := db.Prepare(`DELETE FROM reservation_facility WHERE reservation_id = ?`)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := stmt.Close(); closeErr != nil {
			err = closeErr
		}
	}()
	return stmt.Exec(reservation_id)
}
