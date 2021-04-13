package config

import "os"

func Port() string {
	return os.Getenv("PORT")
}

func SecretKey() string {
	return os.Getenv("SECRET_KEY")
}
