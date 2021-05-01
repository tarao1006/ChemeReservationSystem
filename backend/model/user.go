package model

type UserAPI struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	NameRuby     string  `json:"name_ruby"`
	EmailAddress string  `json:"email_address"`
	Password     string  `json:"password"`
	Types        []int64 `json:"types"`
}

type User struct {
	ID           string     `json:"id"`
	Name         string     `json:"name"`
	NameRuby     string     `json:"name_ruby"`
	EmailAddress string     `json:"email_address"`
	Types        []UserType `json:"types"`
}

type UserDTO struct {
	ID              string `db:"id"`
	Name            string `db:"name"`
	NameRuby        string `db:"name_ruby"`
	PasswordDigest  []byte `db:"password_digest"`
	EmailAddress    string `db:"email_address"`
	RememberMeToken []byte `db:"remember_me_token"`
}

type UserDTOWithType struct {
	ID             string `db:"id"`
	Name           string `db:"name"`
	NameRuby       string `db:"name_ruby"`
	PasswordDigest []byte `db:"password_digest"`
	EmailAddress   string `db:"email_address"`
	TypeID         int64  `db:"type_id"`
	TypeName       string `db:"type_name"`
}
