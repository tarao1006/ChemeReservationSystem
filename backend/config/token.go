package config

import (
	"os"
	"time"
)

func SecretKeyAccessToken() []byte {
	return []byte(os.Getenv("SECRET_KEY_ACCESS_TOKEN"))
}

func SecretKeyRememberMeToken() []byte {
	return []byte(os.Getenv("SECRET_KEY_REMEMBER_ME_TOKEN"))
}

func CookieNameAccessToken() string {
	return os.Getenv("COOKIE_NAME_ACCESS_TOKEN")
}

func CookieNameRememberMeToken() string {
	return os.Getenv("COOKIE_NAME_REMEMBER_ME_TOKEN")
}

func IdentityKeyAccessToken() string {
	return os.Getenv("KEY_ACCESS_TOKEN")
}

func IdentityKeyRememberMeToken() string {
	return os.Getenv("KEY_REMEMBER_ME_TOKEN")
}

func Realm() string {
	return os.Getenv("REALM")
}

func TimeoutAccessToken() time.Duration {
	return time.Hour * 24 * (365*3 + 366)
}

func TimeoutRememberMeToken() time.Duration {
	return time.Hour * 24 * (365*3 + 366)
}

func SigningAlgorithm() string {
	return "HS256"
}

func TokenLookup() string {
	return "Authorization"
}

func TokenHeadName() string {
	return "Bearer"
}

func TimeFunc() time.Time {
	return time.Now()
}
