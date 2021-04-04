package model

func (UserType) TableName() string {
	return "user_type"
}

type UserType struct {
	ID   int64  `db:"id" json:"id"`
	Name string `name:"name" json:"name"`
}
