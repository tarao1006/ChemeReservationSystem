package model

type FacilityAPI struct {
	Name  string  `json:"name"`
	Types []int64 `json:"types"`
}

type Facility struct {
	ID        int64          `json:"id"`
	Name      string         `json:"name"`
	ColorCode string         `json:"color_code"`
	Types     []FacilityType `json:"types"`
}

type FacilityDTO struct {
	ID        int64  `db:"id"`
	Name      string `db:"name"`
	ColorCode string `db:"color_code"`
}

type FacilityDTOWithType struct {
	ID        int64  `db:"id"`
	Name      string `db:"name"`
	ColorCode string `db:"color_code"`
	TypeID    int64  `db:"type_id"`
	TypeName  string `db:"type_name"`
}
