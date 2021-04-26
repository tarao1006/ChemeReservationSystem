package config

import "os"

func Port() string {
	return os.Getenv("PORT")
}

func SecretKey() []byte {
	return []byte(os.Getenv("SECRET_KEY_ACCESS_TOKEN"))
}

func RememberMeTokenSecretKey() []byte {
	return []byte(os.Getenv("SECRET_KEY_REMEMBER_ME_TOKEN"))
}

func Realm() string {
	return os.Getenv("REALM")
}

func CookieName() string {
	return os.Getenv("COOKIE_NAME_ACCESS_TOKEN")
}

func RememberMeTokenCookieName() string {
	return os.Getenv("COOKIE_NAME_REMEMBER_ME_TOKEN")
}

func IdentityKey() string {
	return os.Getenv("KEY_ACCESS_TOKEN")
}

func RememberTokenKey() string {
	return os.Getenv("KEY_REMEMBER_ME_TOKEN")
}
