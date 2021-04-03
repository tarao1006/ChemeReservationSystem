package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/controller"
	"github.com/tarao1006/ChemeReservationSystem/db"
)

type Server struct {
	router *gin.Engine
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Init(dsn string) error {
	db.Init(dsn)
	s.router = router()
	return nil
}

func (s *Server) Run(port int) {
	if err := s.router.Run(":" + strconv.Itoa(port)); err != nil {
		panic(err)
	}
}

func router() *gin.Engine {
	r := gin.Default()

	u := r.Group("/user")
	{
		c := controller.NewUserController()
		u.GET("", c.Index)
		u.GET("/:id", c.Show)
		u.POST("", c.Create)
		u.PUT("/:id", c.Update)
		u.DELETE("/:id", c.Delete)
	}

	f := r.Group("/facility")
	{
		c := controller.NewUserController()
		f.GET("", c.Index)
		f.GET("/:id", c.Show)
		f.POST("", c.Create)
		f.PUT("/:id", c.Update)
		f.DELETE("/:id", c.Delete)
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	return r
}
