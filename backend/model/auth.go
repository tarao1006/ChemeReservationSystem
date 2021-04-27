package model

type Auth struct {
	ID         string `json:"id"`
	Password   string `json:"password"`
	RememberMe bool   `json:"remember_me"`
}

type Password struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}
