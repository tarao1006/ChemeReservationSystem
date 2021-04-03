package main

import (
	"log"

	"github.com/tarao1006/ChemeReservationSystem/server"
)

func main() {
	var (
		dsn  = "root:password@tcp(db:3306)/cheme_reservation_system"
		port = 8000
	)

	s := server.NewServer()
	if err := s.Init(dsn); err != nil {
		log.Fatal(err)
	}
	s.Run(port)
}
