package config

import "os"

func Port() string {
	return os.Getenv("PORT")
}

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
