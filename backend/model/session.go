package model

import "time"

type Session struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
}
