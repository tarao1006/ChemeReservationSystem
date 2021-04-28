package model

import "time"

type Session struct {
	ID       string    `db:"id"`
	UserID   string    `db:"user_id"`
	ExpireAt time.Time `db:"expire_at"`
}
