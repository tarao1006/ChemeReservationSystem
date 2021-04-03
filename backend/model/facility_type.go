package model

func (FacilityType) TableName() string {
	return "facility_type"
}

type FacilityType struct {
	ID   int    `db:"id" json:"id"`
	Name string `name:"name" json:"name"`
}
