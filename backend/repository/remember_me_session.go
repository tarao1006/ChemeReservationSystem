package repository

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type RememberMeSessionRepository struct{}

func NewRememberMeSessionRepository() *RememberMeSessionRepository {
	return &RememberMeSessionRepository{}
}

func (RememberMeSessionRepository) GetByID(db *sqlx.DB, id string) (*model.RememberMeSession, error) {
	var session model.RememberMeSession
	if err := db.Get(&session, `
		SELECT id, user_id, expires_at FROM remember_me_session WHERE id = ?
	`, id); err != nil {
		return nil, err
	}
	return &session, nil
}

func (RememberMeSessionRepository) Create(db *sqlx.Tx, id string, userID string, expireAt time.Time) (result sql.Result, err error) {
	query := `INSERT INTO remember_me_session (id, user_id, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = ?, expires_at = ?`
	return db.Exec(query, id, userID, expireAt, id, expireAt)
}

func (RememberMeSessionRepository) Delete(db *sqlx.Tx, id string) (result sql.Result, err error) {
	query := `DELETE FROM remember_me_session WHERE id = ?`
	return db.Exec(query, id)
}
