package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"gorm.io/gorm"
)

type Server struct {
	db     *gorm.DB
	router *gin.Engine
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Init(dsn string) error {
	db, err := db.Open(dsn)
	if err != nil {
		return fmt.Errorf("failed init db. %s", err)
	}
	s.db = db
	s.router = s.Route()
	return nil
}

func (s *Server) Run(port int) {
	if err := s.router.Run(":" + strconv.Itoa(port)); err != nil {
		panic(err)
	}
}

func (s *Server) Route() *gin.Engine {
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	return r
}
