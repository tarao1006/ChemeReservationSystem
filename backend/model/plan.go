package model

func (Plan) TableName() string {
	return "plan"
}

type Plan struct {
	ID   string `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}
