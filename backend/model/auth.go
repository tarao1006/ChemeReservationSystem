package model

import "github.com/dgrijalva/jwt-go"

type Auth struct {
	EmailAddress string `json:"email_address"`
	Password     string `json:"password"`
}

type Claims struct {
	ID           string
	Name         string
	EmailAddress string
	*jwt.StandardClaims
}
