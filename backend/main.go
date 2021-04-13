package main

import (
	"log"

	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/server"
)

func main() {
	var (
		dsn  = config.DSN()
		port = config.Port()
	)

	s := server.NewServer()
	if err := s.Init(dsn); err != nil {
		log.Fatalf("failed init server. %s", err)
	}
	s.Run(port)
}
