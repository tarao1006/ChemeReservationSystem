package server

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
)

type Server struct {
	router *gin.Engine
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Init(dsn string) error {
	if err := db.Init(dsn); err != nil {
		return fmt.Errorf("failed to initialize db. %s", err)
	}

	s.router = NewRouter()
	return nil
}

func (s *Server) Run(port string) error {
	if err := s.router.Run(":" + port); err != nil {
		return err
	}
	return nil
}

func PingHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
