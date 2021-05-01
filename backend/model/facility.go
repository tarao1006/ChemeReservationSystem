package model

type FacilityAPI struct {
	Name  string  `json:"name"`
	Types []int64 `json:"types"`
}

type Facility struct {
	ID    int64          `json:"id"`
	Name  string         `json:"name"`
	Types []FacilityType `json:"types"`
}

type FacilityDTO struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}

type FacilityDTOWithType struct {
	ID       int64  `db:"id"`
	Name     string `db:"name"`
	TypeID   int64  `db:"type_id"`
	TypeName string `db:"type_name"`
}
