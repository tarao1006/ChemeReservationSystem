package model

func (UserType) TableName() string {
	return "user_type"
}

type UserType struct {
	ID   int    `db:"id" json:"id"`
	Name string `name:"name" json:"name"`
}
