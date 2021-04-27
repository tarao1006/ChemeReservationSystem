package repository

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

type SessionRepository struct{}

func NewSessionRepository() *SessionRepository {
	return &SessionRepository{}
}

func (SessionRepository) GetUserIDByID(db *sqlx.DB, id string) (string, error) {
	var userID string
	if err := db.Get(&userID, `
		SELECT user_id FROM session WHERE id = ?
	`, id); err != nil {
		return "", err
	}
	return userID, nil
}

func (SessionRepository) Create(db *sqlx.Tx, id string, userID string, expire_at time.Time) (result sql.Result, err error) {
	query := `INSERT INTO session (id, user_id, expire_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = ?, expire_at = ?`
	return db.Exec(query, id, userID, expire_at, id, expire_at)
}