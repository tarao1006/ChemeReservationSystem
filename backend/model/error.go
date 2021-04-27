package model

import "errors"

var (
	ErrInvalidUserID            = errors.New("user id is invalid")
	ErrInvalidPassword          = errors.New("password is invalid")
	ErrInvalidAccessToken       = errors.New("access token is invalid")
	ErrNewPasswordMustBeChanged = errors.New("new password must be changed")
)
