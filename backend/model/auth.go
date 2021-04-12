package model

import "github.com/dgrijalva/jwt-go"

type Auth struct {
	ID       string `json:"id"`
	Password string `json:"password"`
}

type Claims struct {
	ID           string
	Name         string
	EmailAddress string
	*jwt.StandardClaims
}
