package config

import "os"

func Port() string {
	return os.Getenv("PORT")
}

func Mode() string {
	return os.Getenv("MODE")
}
