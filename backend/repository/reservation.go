package repository

import (
	"database/sql"
	"sort"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type ReservationRepository struct{}

func NewReservationRepository() *ReservationRepository {
	return &ReservationRepository{}
}

func (ur *ReservationRepository) GetAll(db *sqlx.DB) ([]model.Reservation, error) {
	var reservations []model.ReservationDTOWithStruct
	query := `
		SELECT
			r.id,
			r.creator_id,
			r.start_at,
			r.end_at,
			r.plan_id,
			r.plan_memo,
			r.created_at,
			r.updated_at,
			ru.user_id as user_id,
			rf.facility_id as facility_id
		FROM
			reservation as r
		LEFT OUTER JOIN
			reservation_user as ru
		ON
			r.id = ru.reservation_id
		LEFT OUTER JOIN
			reservation_facility as rf
		ON
			r.id = rf.reservation_id
		ORDER BY r.id
	`
	if err := db.Select(&reservations, query); err != nil {
		return nil, err
	}

	res := []model.Reservation{}
	userRepo := NewUserRepository()
	planRepo := NewPlanRepository()
	facilityRepo := NewFacilityRepository()

	mapReservationIDs := map[int64]int64{}
	reservationIDs := []int64{}
	mapReservations := map[int64]*model.Reservation{}
	mapUserIDs := map[int64][]string{}
	mapFacilityIDs := map[int64][]int64{}

	for _, r := range reservations {
		exists := false

		if _, ok := mapReservationIDs[r.ID]; ok {
			exists = true
		}

		if !exists {
			mapReservationIDs[r.ID] = 1
			reservationIDs = append(reservationIDs, r.ID)

			creator, err := userRepo.FindByID(db, r.CreatorID)
			if err != nil {
				return nil, err
			}

			plan, err := planRepo.FindByID(db, r.PlanID)
			if err != nil {
				return nil, err
			}

			mapReservations[r.ID] = &model.Reservation{
				ID:        r.ID,
				Creator:   creator,
				StartAt:   r.StartAt,
				EndAt:     r.EndAt,
				Plan:      plan,
				PlanMemo:  r.PlanMemo,
				CreatedAt: r.CreatedAt,
			}
		}
	}

	for _, r := range reservations {
		mapUserIDs[r.ID] = append(mapUserIDs[r.ID], r.UserID.String)
		mapFacilityIDs[r.ID] = append(mapFacilityIDs[r.ID], r.FacilityID.Int64)
	}

	for _, id := range reservationIDs {
		userIDs := mapUserIDs[id]
		facilityIDs := mapFacilityIDs[id]

		users, err := userRepo.FindByIDs(db, userIDs)
		if err != nil {
			return nil, err
		}

		facilities, err := facilityRepo.FindByIDs(db, facilityIDs)
		if err != nil {
			return nil, err
		}

		r := mapReservations[id]
		r.Attendees = users
		r.Places = facilities

		res = append(res, *r)
	}

	sort.Slice(res, func(i, j int) bool { return res[i].StartAt.Unix() < res[j].StartAt.Unix() })

	return res, nil
}

func (ur *ReservationRepository) GetAllInRange(db *sqlx.DB, dr *model.DateRange) ([]model.Reservation, error) {
	var reservations []model.ReservationDTOWithStruct
	query := `
		SELECT
			r.id,
			r.creator_id,
			r.start_at,
			r.end_at,
			r.plan_id,
			r.plan_memo,
			r.created_at,
			r.updated_at,
			ru.user_id as user_id,
			rf.facility_id as facility_id
		FROM
			reservation as r
		LEFT OUTER JOIN
			reservation_user as ru
		ON
			r.id = ru.reservation_id
		LEFT OUTER JOIN
			reservation_facility as rf
		ON
			r.id = rf.reservation_id
		WHERE start_at BETWEEN ? AND ?
		ORDER BY r.id
	`
	if err := db.Select(&reservations, query, dr.From, dr.To); err != nil {
		return nil, err
	}

	res := []model.Reservation{}
	userRepo := NewUserRepository()
	planRepo := NewPlanRepository()
	facilityRepo := NewFacilityRepository()

	mapReservationIDs := map[int64]int64{}
	reservationIDs := []int64{}
	mapReservations := map[int64]*model.Reservation{}
	mapUserIDs := map[int64][]string{}
	mapFacilityIDs := map[int64][]int64{}

	for _, r := range reservations {
		exists := false

		if _, ok := mapReservationIDs[r.ID]; ok {
			exists = true
		}

		if !exists {
			mapReservationIDs[r.ID] = 1
			reservationIDs = append(reservationIDs, r.ID)

			creator, err := userRepo.FindByID(db, r.CreatorID)
			if err != nil {
				return nil, err
			}

			plan, err := planRepo.FindByID(db, r.PlanID)
			if err != nil {
				return nil, err
			}

			mapReservations[r.ID] = &model.Reservation{
				ID:        r.ID,
				Creator:   creator,
				StartAt:   r.StartAt,
				EndAt:     r.EndAt,
				Plan:      plan,
				PlanMemo:  r.PlanMemo,
				CreatedAt: r.CreatedAt,
			}
		}
	}

	for _, r := range reservations {
		mapUserIDs[r.ID] = append(mapUserIDs[r.ID], r.UserID.String)
		mapFacilityIDs[r.ID] = append(mapFacilityIDs[r.ID], r.FacilityID.Int64)
	}

	for _, id := range reservationIDs {
		userIDs := mapUserIDs[id]
		facilityIDs := mapFacilityIDs[id]

		users, err := userRepo.FindByIDs(db, userIDs)
		if err != nil {
			return nil, err
		}

		facilities, err := facilityRepo.FindByIDs(db, facilityIDs)
		if err != nil {
			return nil, err
		}

		r := mapReservations[id]
		r.Attendees = users
		r.Places = facilities

		res = append(res, *r)
	}

	sort.Slice(res, func(i, j int) bool { return res[i].StartAt.Unix() < res[j].StartAt.Unix() })

	return res, nil
}

func (ReservationRepository) FindByID(db *sqlx.DB, id int64) (*model.Reservation, error) {
	var reservations []model.ReservationDTOWithStruct
	query := `
		SELECT
			r.id,
			r.creator_id,
			r.start_at,
			r.end_at,
			r.plan_id,
			r.plan_memo,
			r.created_at,
			r.updated_at,
			ru.user_id as user_id,
			rf.facility_id as facility_id
		FROM
			reservation as r
		LEFT OUTER JOIN
			reservation_user as ru
		ON
			r.id = ru.reservation_id
		LEFT OUTER JOIN
			reservation_facility as rf
		ON
			r.id = rf.reservation_id
		WHERE r.id = ?
	`
	if err := db.Select(&reservations, query, id); err != nil {
		return nil, err
	}

	userRepo := NewUserRepository()
	planRepo := NewPlanRepository()
	facilityRepo := NewFacilityRepository()

	creator, err := userRepo.FindByID(db, reservations[0].CreatorID)
	if err != nil {
		return nil, err
	}

	plan, err := planRepo.FindByID(db, reservations[0].PlanID)
	if err != nil {
		return nil, err
	}

	userIDs := []string{}
	facilityIDs := []int64{}

	for _, r := range reservations {
		userIDExist := false
		for _, userID := range userIDs {
			if userID == r.UserID.String {
				userIDExist = true
			}
		}
		if !userIDExist {
			userIDs = append(userIDs, r.UserID.String)
		}

		facilityIDExist := false
		for _, facilityID := range facilityIDs {
			if facilityID == r.FacilityID.Int64 {
				facilityIDExist = true
			}
		}
		if !facilityIDExist {
			facilityIDs = append(facilityIDs, r.FacilityID.Int64)
		}
	}

	users, err := userRepo.FindByIDs(db, userIDs)
	if err != nil {
		return nil, err
	}

	facilities, err := facilityRepo.FindByIDs(db, facilityIDs)
	if err != nil {
		return nil, err
	}

	return &model.Reservation{
		ID:        reservations[0].ID,
		Creator:   creator,
		StartAt:   reservations[0].StartAt,
		EndAt:     reservations[0].EndAt,
		Plan:      plan,
		PlanMemo:  reservations[0].PlanMemo,
		CreatedAt: reservations[0].CreatedAt,
		UpdatedAt: reservations[0].UpdatedAt,
		Attendees: users,
		Places:    facilities,
	}, nil
}

func (ReservationRepository) FindDTOWithStructSliceByID(db *sqlx.DB, id int64) (*model.ReservationDTOWithStructSlice, error) {
	var reservations []model.ReservationDTOWithStruct
	query := `
		SELECT
			r.id,
			r.creator_id,
			r.start_at,
			r.end_at,
			r.plan_id,
			r.plan_memo,
			r.created_at,
			r.updated_at,
			ru.user_id as user_id,
			rf.facility_id as facility_id
		FROM
			reservation as r
		LEFT OUTER JOIN
			reservation_user as ru
		ON
			r.id = ru.reservation_id
		LEFT OUTER JOIN
			reservation_facility as rf
		ON
			r.id = rf.reservation_id
		WHERE r.id = ?
	`
	if err := db.Select(&reservations, query, id); err != nil {
		return nil, err
	}

	userIDs := []string{}
	facilityIDs := []int64{}

	for _, r := range reservations {
		userIDExist := false
		for _, userID := range userIDs {
			if userID == r.UserID.String {
				userIDExist = true
			}
		}
		if !userIDExist {
			userIDs = append(userIDs, r.UserID.String)
		}

		facilityIDExist := false
		for _, facilityID := range facilityIDs {
			if facilityID == r.FacilityID.Int64 {
				facilityIDExist = true
			}
		}
		if !facilityIDExist {
			facilityIDs = append(facilityIDs, r.FacilityID.Int64)
		}
	}

	return &model.ReservationDTOWithStructSlice{
		ID:          reservations[0].ID,
		CreatorID:   reservations[0].CreatorID,
		StartAt:     reservations[0].StartAt,
		EndAt:       reservations[0].EndAt,
		PlanID:      reservations[0].PlanID,
		PlanMemo:    reservations[0].PlanMemo,
		CreatedAt:   reservations[0].CreatedAt,
		UpdatedAt:   reservations[0].UpdatedAt,
		UserIDs:     userIDs,
		FacilityIDs: facilityIDs,
	}, nil
}

func (ReservationRepository) Create(db *sqlx.Tx, param *model.ReservationDTO) (result sql.Result, err error) {
	query := `INSERT INTO reservation (creator_id, start_at, end_at, plan_id, plan_memo) VALUES (?, ?, ?, ?, ?)`
	return db.Exec(query, param.CreatorID, param.StartAt, param.EndAt, param.PlanID, param.PlanMemo)
}

func (ReservationRepository) Update(db *sqlx.Tx, id int64, param *model.ReservationDTO) (result sql.Result, err error) {
	query := `UPDATE reservation SET creator_id = ?, start_at = ?, end_at = ?, plan_id = ?, plan_memo = ? WHERE id = ?`
	return db.Exec(query, param.CreatorID, param.StartAt, param.EndAt, param.PlanID, param.PlanMemo, id)
}

func (ReservationRepository) UpdateStartAtByID(db *sqlx.Tx, id int64, s time.Time) (result sql.Result, err error) {
	query := `UPDATE reservation SET start_at = ? WHERE id = ?`
	return db.Exec(query, s, id)
}

func (ReservationRepository) UpdateEndAtByID(db *sqlx.Tx, id int64, e time.Time) (result sql.Result, err error) {
	query := `UPDATE reservation SET end_at = ? WHERE id = ?`
	return db.Exec(query, e, id)
}

func (ReservationRepository) UpdatePlanIDByID(db *sqlx.Tx, id int64, p int64) (result sql.Result, err error) {
	query := `UPDATE reservation SET plan_id = ? WHERE id = ?`
	return db.Exec(query, p, id)
}

func (ReservationRepository) UpdatePlanMemoByID(db *sqlx.Tx, id int64, p string) (result sql.Result, err error) {
	query := `UPDATE reservation SET plan_memo = ? WHERE id = ?`
	return db.Exec(query, p, id)
}

func (ReservationRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	query := `DELETE FROM reservation WHERE id = ?`
	return db.Exec(query, id)
}

func (ReservationRepository) AddUser(db *sqlx.Tx, reservationID int64, userID string) (result sql.Result, err error) {
	query := `INSERT INTO reservation_user (reservation_id, user_id) VALUES (?, ?)`
	return db.Exec(query, reservationID, userID)
}

func (ReservationRepository) RemoveUser(db *sqlx.Tx, reservationID int64, userID string) (result sql.Result, err error) {
	query := `DELETE FROM reservation_user WHERE reservation_id = ? AND user_id = ?`
	return db.Exec(query, reservationID, userID)
}

func (ReservationRepository) RemoveAllUsers(db *sqlx.Tx, reservationID int64) (result sql.Result, err error) {
	query := `DELETE FROM reservation_user WHERE reservation_id = ?`
	return db.Exec(query, reservationID)
}

func (ReservationRepository) AddFacility(db *sqlx.Tx, reservationID int64, facilityID int64) (result sql.Result, err error) {
	query := `INSERT INTO reservation_facility (reservation_id, facility_id) VALUES (?, ?)`
	return db.Exec(query, reservationID, facilityID)
}

func (ReservationRepository) RemoveFacility(db *sqlx.Tx, reservationID int64, facilityID int64) (result sql.Result, err error) {
	query := `DELETE FROM reservation_facility WHERE reservation_id = ? AND facility_id = ?`
	return db.Exec(query, reservationID, facilityID)
}

func (ReservationRepository) RemoveAllFacilities(db *sqlx.Tx, reservationID int64) (result sql.Result, err error) {
	query := `DELETE FROM reservation_facility WHERE reservation_id = ?`
	return db.Exec(query, reservationID)
}
