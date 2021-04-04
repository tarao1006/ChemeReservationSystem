package db

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

func Init(dsn string) error {
	var err error
	db, err = sqlx.Open("mysql", dsn)
	if err != nil {
		return err
	}
	return nil
}

func GetDB() *sqlx.DB {
	return db
}
