package model

func (Plan) TableName() string {
	return "plan"
}

type Plan struct {
	ID   int64  `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}
