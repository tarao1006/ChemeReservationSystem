package model

type User struct {
	ID             string `db:"id" json:"id"`
	Name           string `db:"name" json:"name"`
	NameRuby       string `db:"name_ruby" json:"name_ruby"`
	PasswordDigest string `db:"password_digest" json:"password_digest"`
	EmailAddress   string `db:"email_address" json:"email_address"`
}
