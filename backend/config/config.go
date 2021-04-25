package config

import "os"

func Port() string {
	return os.Getenv("PORT")
}

func SecretKey() []byte {
	return []byte(os.Getenv("SECRET_KEY"))
}

func Realm() string {
	return os.Getenv("REALM")
}

func CookieName() string {
	return os.Getenv("COOKIE_NAME")
}

func IdentityKey() string {
	return os.Getenv("IDENTITY_KEY")
}

func RememberTokenKey() string {
	return os.Getenv("REMEMBER_TOKEN_KEY")
}
