package model

import "errors"

var (
	ErrInvalidUserID            = errors.New("user id is invalid")
	ErrInvalidPassword          = errors.New("password is invalid")
	ErrInvalidAccessToken       = errors.New("access token is invalid")
	ErrNewPasswordMustBeChanged = errors.New("new password must be changed")

	ErrForbidden               = errors.New("you don't have permission to access this resource")
	ErrMissingLoginValues      = errors.New("missing Username or Password")
	ErrFailedAuthentication    = errors.New("incorrect Username or Password")
	ErrFailedTokenCreation     = errors.New("failed to create JWT Token")
	ErrExpiredToken            = errors.New("token is expired")
	ErrEmptyAuthHeader         = errors.New("auth header is empty")
	ErrMissingExpField         = errors.New("missing exp field")
	ErrWrongFormatOfExp        = errors.New("exp must be float64 format")
	ErrInvalidAuthHeader       = errors.New("auth header is invalid")
	ErrInvalidSigningAlgorithm = errors.New("invalid signing algorithm")
)
