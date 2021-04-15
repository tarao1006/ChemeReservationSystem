package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
)

func TXHandler(db *sqlx.DB, f func(*sqlx.Tx) error) (err error) {
	tx, err := db.Beginx()
	if err != nil {
		return fmt.Errorf("start transaction failed: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			rollBackErr := tx.Rollback()
			if rollBackErr != nil {
				log.Fatalf("rollback failed: %v", rollBackErr)
			}
			log.Print("Rollback operation")
			err = fmt.Errorf("transaction: operation failed: %w", err)
		} else if err != nil {
			err = fmt.Errorf("transaction: operation failed: %w", err)
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()
	err = f(tx)
	return err
}
