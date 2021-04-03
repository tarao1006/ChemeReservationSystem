package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

func (u *UserController) Index(c *gin.Context) {
	s := service.NewUserService()

	users, err := s.GetAll()

	fmt.Println(users)

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		fmt.Println(err)
	} else {
		c.JSON(http.StatusOK, users)
	}
}
