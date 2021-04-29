package server

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/controller"
	"github.com/tarao1006/ChemeReservationSystem/middleware"
)

type Router struct{}

func NewRouter() *gin.Engine {
	authMiddleware := middleware.NewAuthMiddleware()
	config := cors.New(cors.Config{
		AllowHeaders: []string{
			"Authorization",
			"Access-Control-Allow-Origin",
			"Content-Type",
		},
		AllowOrigins: []string{
			"http://localhost:8080",
		},
		AllowCredentials: true,
	})

	e := gin.Default()
	e.Use(config)

	e.GET("/ping", PingHandler)

	{
		c := controller.NewAuthController()
		e.POST("/login", c.LoginHandler)
		e.POST("/logout", c.LogoutHandler)
	}

	{
		c := controller.NewUserController()
		e.POST("/validate", c.ValidateUserID)
	}

	v1 := e.Group("/api/v1")
	v1.Use(authMiddleware.Middleware())
	{
		v1.GET("/ping", PingHandler)

		me := v1.Group("/me")
		{
			c := controller.NewUserController()
			me.GET("", c.ShowMe)
		}

		u := v1.Group("/user")
		{
			c := controller.NewUserController()
			u.GET("", c.Index)
			u.GET("/:id", c.Show)
			u.POST("", c.Create)
			u.PUT("/:id", c.Update)
			u.DELETE("/:id", c.Delete)

			u.PUT("/:id/password", c.UpdatePassword)
		}

		ut := v1.Group("/user-type")
		{
			c := controller.NewUserTypeController()
			ut.GET("", c.Index)
			ut.GET("/:id", c.Show)
			ut.POST("", c.Create)
			ut.PUT("/:id", c.Update)
			ut.DELETE("/:id", c.Delete)
		}

		f := v1.Group("/facility")
		{
			c := controller.NewFacilityController()
			f.GET("", c.Index)
			f.GET("/:id", c.Show)
			f.POST("", c.Create)
			f.PUT("/:id", c.Update)
			f.DELETE("/:id", c.Delete)
		}

		ft := v1.Group("/facility-type")
		{
			c := controller.NewFacilityTypeController()
			ft.GET("", c.Index)
			ft.GET("/:id", c.Show)
			ft.POST("", c.Create)
			ft.PUT("/:id", c.Update)
			ft.DELETE("/:id", c.Delete)
		}

		r := v1.Group("/reservation")
		{
			c := controller.NewReservationController()
			r.GET("", c.Index)
			r.GET("/:id", c.Show)
			r.POST("", c.Create)
			r.PUT("/:id", c.Update)
			r.DELETE("/:id", c.Delete)
		}

		p := v1.Group("/plan")
		{
			c := controller.NewFacilityTypeController()
			p.GET("", c.Index)
			p.GET("/:id", c.Show)
			p.POST("", c.Create)
			p.PUT("/:id", c.Update)
			p.DELETE("/:id", c.Delete)
		}
	}

	return e
}
