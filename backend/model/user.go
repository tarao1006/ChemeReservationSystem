package model

func (User) TableName() string {
	return "user"
}

type User struct {
	ID             string `db:"id" json:"id" binding:"required"`
	Name           string `db:"name" json:"name" binding:"required"`
	NameRuby       string `db:"name_ruby" json:"name_ruby" binding:"required"`
	PasswordDigest string `db:"password_digest" json:"password_digest" binding:"required"`
	EmailAddress   string `db:"email_address" json:"email_address" binding:"required"`
}
