package model

import (
	"time"

	"github.com/tarao1006/ChemeReservationSystem/config"
)

type Session struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
}

func (s *Session) IsExpired() bool {
	return s.ExpiresAt.Unix() < config.TimeFunc().Unix()
}
