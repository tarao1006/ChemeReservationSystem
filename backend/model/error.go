package model

import "errors"

var (
	ErrInvalidUserID            = errors.New("user id is invalid")
	ErrNewPasswordMustBeChanged = errors.New("new password must be changed")
)
