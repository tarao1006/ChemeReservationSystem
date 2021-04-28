package model

import (
	"time"

	"github.com/tarao1006/ChemeReservationSystem/config"
)

type RememberMeSession struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
}

func (s *RememberMeSession) IsExpired() bool {
	return s.ExpiresAt.Unix() < config.TimeFunc().Unix()
}
