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

	ut := r.Group("/user_type")
	{
		c := controller.NewUserTypeController()
		ut.GET("", c.Index)
		ut.GET("/:id", c.Show)
		ut.POST("", c.Create)
		ut.PUT("/:id", c.Update)
		ut.DELETE("/:id", c.Delete)
	}

	f := r.Group("/facility")
	{
		c := controller.NewFacilityController()
		f.GET("", c.Index)
		f.GET("/:id", c.Show)
		f.POST("", c.Create)
		f.PUT("/:id", c.Update)
		f.DELETE("/:id", c.Delete)
	}

	ft := r.Group("/facility_type")
	{
		c := controller.NewFacilityTypeController()
		ft.GET("", c.Index)
		ft.GET("/:id", c.Show)
		ft.POST("", c.Create)
		ft.PUT("/:id", c.Update)
		ft.DELETE("/:id", c.Delete)
	}

	p := r.Group("/plan")
	{
		c := controller.NewFacilityTypeController()
		p.GET("", c.Index)
		p.GET("/:id", c.Show)
		p.POST("", c.Create)
		p.PUT("/:id", c.Update)
		p.DELETE("/:id", c.Delete)
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	return r
}
