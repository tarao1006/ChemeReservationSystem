package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type PlanRepository struct{}

func NewPlanRepository() *PlanRepository {
	return &PlanRepository{}
}

func (PlanRepository) GetAll(db *sqlx.DB) ([]model.Plan, error) {
	plans := []model.Plan{}
	if err := db.Select(&plans, `SELECT id, name FROM plan ORDER BY id`); err != nil {
		return nil, err
	}
	return plans, nil
}

func (PlanRepository) FindByID(db *sqlx.DB, id int64) (*model.Plan, error) {
	var plan model.Plan
	if err := db.Get(&plan, `
		SELECT id, name FROM plan WHERE id = ?
	`, id); err != nil {
		return nil, err
	}
	return &plan, nil
}

func (PlanRepository) Create(db *sqlx.Tx, p *model.Plan) (result sql.Result, err error) {
	query := `INSERT INTO plan (name) VALUES (?)`
	return db.Exec(query, p.Name)
}

func (PlanRepository) Update(db *sqlx.Tx, id int64, param *model.Plan) (result sql.Result, err error) {
	query := `UPDATE plan SET name = ? WHERE id = ?`
	return db.Exec(query, param.Name, id)
}

func (PlanRepository) Delete(db *sqlx.Tx, id int64) (result sql.Result, err error) {
	query := `DELETE FROM plan WHERE id = ?`
	return db.Exec(query, id)
}
