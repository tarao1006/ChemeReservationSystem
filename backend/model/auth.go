package model

import "github.com/dgrijalva/jwt-go"

type Auth struct {
	ID       string `json:"id"`
	Password string `json:"password"`
	Remember bool   `json:"remember"`
}

type Claims struct {
	ID           string
	Name         string
	EmailAddress string
	*jwt.StandardClaims
}

type Password struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}
