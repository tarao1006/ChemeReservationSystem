package repository

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type SessionRepository struct{}

func NewSessionRepository() *SessionRepository {
	return &SessionRepository{}
}

func (SessionRepository) GetByID(db *sqlx.DB, id string) (*model.Session, error) {
	var session model.Session
	if err := db.Get(&session, `
		SELECT id, user_id, expires_at FROM session WHERE id = ?
	`, id); err != nil {
		if err == sql.ErrNoRows {
			return nil, model.ErrSessionNotFound
		}
		return nil, err
	}
	return &session, nil
}

func (SessionRepository) Create(db *sqlx.Tx, id string, userID string, expireAt time.Time) (result sql.Result, err error) {
	query := `INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = ?, expires_at = ?`
	return db.Exec(query, id, userID, expireAt, id, expireAt)
}

func (SessionRepository) Delete(db *sqlx.Tx, id string) (result sql.Result, err error) {
	query := `DELETE FROM session WHERE id = ?`
	return db.Exec(query, id)
}
