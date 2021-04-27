package repository

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

type RememberMeSessionRepository struct{}

func NewRememberMeSessionRepository() *RememberMeSessionRepository {
	return &RememberMeSessionRepository{}
}

func (RememberMeSessionRepository) GetUserIDByID(db *sqlx.DB, id string) (string, error) {
	var userID string
	if err := db.Get(&userID, `
		SELECT user_id FROM remember_me_session WHERE id = ?
	`, id); err != nil {
		return "", err
	}
	return userID, nil
}

func (RememberMeSessionRepository) Create(db *sqlx.Tx, id string, userID string, expireAt time.Time) (result sql.Result, err error) {
	query := `INSERT INTO remember_me_session (id, user_id, expire_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = ?, expire_at = ?`
	return db.Exec(query, id, userID, expireAt, id, expireAt)
}

func (RememberMeSessionRepository) Delete(db *sqlx.Tx, id string) (result sql.Result, err error) {
	query := `DELETE FROM remember_me_session WHERE id = ?`
	return db.Exec(query, id)
}
