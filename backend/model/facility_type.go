package model

type FacilityType struct {
	ID   int64  `db:"id" json:"id"`
	Name string `name:"name" json:"name"`
}
