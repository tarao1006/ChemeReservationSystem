package model

type Facility struct {
	ID   int    `db:"id"`
	Name string `db:"name" json:"name" binding:"required"`
}
