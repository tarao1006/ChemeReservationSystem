package model

import (
	"database/sql"
	"time"
)

type ReservationAPI struct {
	CreatorID      string    `json:"creator_id"`
	StartAt        time.Time `json:"start_at"`
	EndAt          time.Time `json:"end_at"`
	PlanID         int64     `json:"plan_id"`
	UpdatePlanMemo bool      `json:"update_plan_memo"`
	PlanMemo       string    `json:"plan_memo"`
	UserIDs        []string  `json:"user_ids"`
	FacilityIDs    []int64   `json:"facility_ids"`
}

type Reservation struct {
	ID        int64       `json:"id"`
	Creator   *User       `json:"creator"`
	StartAt   time.Time   `json:"start_at"`
	EndAt     time.Time   `json:"end_at"`
	Plan      *Plan       `json:"plan"`
	PlanMemo  string      `json:"plan_memo"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
	Attendees []*User     `json:"attendees"`
	Places    []*Facility `json:"places"`
}

type ReservationDTO struct {
	ID        int64     `db:"id"`
	CreatorID string    `db:"creator_id"`
	StartAt   time.Time `db:"start_at"`
	EndAt     time.Time `db:"end_at"`
	PlanID    int64     `db:"plan_id"`
	PlanMemo  string    `db:"plan_memo"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

type ReservationDTOWithStruct struct {
	ID         int64          `db:"id"`
	CreatorID  string         `db:"creator_id"`
	StartAt    time.Time      `db:"start_at"`
	EndAt      time.Time      `db:"end_at"`
	PlanID     int64          `db:"plan_id"`
	PlanMemo   string         `db:"plan_memo"`
	CreatedAt  time.Time      `db:"created_at"`
	UpdatedAt  time.Time      `db:"updated_at"`
	UserID     sql.NullString `db:"user_id"`
	FacilityID sql.NullInt64  `db:"facility_id"`
}

type RangeAPI struct {
	From string `form:"from"`
	To   string `form:"to"`
}

type DateRange struct {
	From time.Time
	To   time.Time
}
