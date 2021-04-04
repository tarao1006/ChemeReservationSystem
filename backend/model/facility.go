package model

type Facility struct {
	ID    int64          `json:"id"`
	Name  string         `json:"name"`
	Types []FacilityType `json:"types"`
}

type FacilityDTO struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}
