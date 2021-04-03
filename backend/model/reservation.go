package model

import "time"

func (Reservation) TableName() string {
	return "reservation"
}

type Reservation struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"user_id"`
	StartAt   time.Time `db:"start_at" json:"start_at"`
	EndAt     time.Time `db:"end_at" json:"end_at"`
	PlanID    int       `db:"plan_id" json:"plan_id"`
	PlanMemo  string    `db:"plan_memo" json:"plan_memo"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
