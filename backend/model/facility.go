package model

func (Facility) TableName() string {
	return "facility"
}

type Facility struct {
	ID   int    `db:"id"`
	Name string `db:"name" json:"name" binding:"required"`
}
