package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/controller"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/middleware"
)

type Server struct {
	router *gin.Engine
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Init(dsn string) error {
	if err := db.Init(dsn); err != nil {
		return fmt.Errorf("failed init db. %s", err)
	}
	s.router = router()
	return nil
}

func (s *Server) Run(port int) {
	if err := s.router.Run(":" + strconv.Itoa(port)); err != nil {
		panic(err)
	}
}

func router() *gin.Engine {
	authMiddleware, err := middleware.AuthMiddleware()
	if err != nil {
		panic(err)
	}
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.POST("/login", authMiddleware.LoginHandler)
	r.POST("/logout", authMiddleware.LogoutHandler)

	r.Use(authMiddleware.MiddlewareFunc())
	{
		r.GET("/hello", controller.HelloHandler)

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

		reservation := r.Group("/reservation")
		{
			c := controller.NewReservationController()
			reservation.GET("", c.Index)
			reservation.GET("/:id", c.Show)
			reservation.POST("", c.Create)
			reservation.PUT("/:id", c.Update)
			reservation.DELETE("/:id", c.Delete)
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
	}

	return r
}
