package model

func (FacilityType) TableName() string {
	return "facility_type"
}

type FacilityType struct {
	ID   int64  `db:"id" json:"id"`
	Name string `name:"name" json:"name"`
}
