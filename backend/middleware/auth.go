package middleware

import (
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/tarao1006/ChemeReservationSystem/config"
	"github.com/tarao1006/ChemeReservationSystem/controller"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/service"
)

type AuthMiddleware struct {
	as *service.AuthService
	ss *service.SessionService
	rs *service.RememberMeSessionService
}

func NewAuthMiddleware() *AuthMiddleware {
	return &AuthMiddleware{
		as: service.NewAuthService(),
		ss: service.NewSessionService(),
		rs: service.NewRememberMeSessionService(),
	}
}

func (mw *AuthMiddleware) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		oldAccessToken, err := controller.ParseAccessTokenFromContext(c)
		if err != nil {
			controller.Unauthorized(c, http.StatusForbidden, model.ErrForbidden)
			c.Abort()
			return
		}

		oldAccessTokenClaims := oldAccessToken.Claims.(jwt.MapClaims)
		oldAccessTokenID := oldAccessTokenClaims[config.IdentityKeyAccessToken()].(string)
		oldSession, err := mw.ss.GetByID(oldAccessTokenID)
		if err != nil {
			controller.Unauthorized(c, http.StatusForbidden, model.ErrForbidden)
			c.Abort()
			return
		}

		if oldSession.IsExpired() {
			if err := mw.ss.DeleteByID(oldAccessTokenID); err != nil {
				controller.Unauthorized(c, http.StatusForbidden, model.ErrExpiredToken)
				c.Abort()
				return
			}
			controller.Unauthorized(c, http.StatusForbidden, model.ErrExpiredToken)
			c.Abort()
			return
		}

		newAccessTokenID, newAccessToken, err := controller.GenerateAccessToken()
		if err != nil {
			controller.Unauthorized(c, http.StatusUnauthorized, err)
			c.Abort()
			return
		}
		if err := mw.ss.Update(oldAccessTokenID, newAccessTokenID, config.TimeFunc().Add(config.TimeoutAccessToken())); err != nil {
			controller.Unauthorized(c, http.StatusUnauthorized, err)
			c.Abort()
			return
		}
		c.Header("Authorization", config.TokenHeadName()+" "+newAccessToken)

		c.Next()
	}
}

func (mw *AuthMiddleware) MiddlewareWithRememberMeToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		// access token と remember me token を取得する
		oldAccessToken, errAccessToken := controller.ParseAccessTokenFromContext(c)
		oldRememberMeToken, errRememberMeToken := controller.ParseRememberMeTokenFromContext(c)

		var (
			err                         error
			oldAccessTokenClaims        jwt.MapClaims
			oldAccessTokenID            string
			oldSession                  *model.Session
			oldSessionExpired           bool
			oldRememberMeTokenClaims    jwt.MapClaims
			oldRememberMeTokenID        string
			oldRememberMeSession        *model.RememberMeSession
			oldRememberMeSessionExpired bool
		)

		// access token と remember me token の両方がない場合
		if errAccessToken != nil && errRememberMeToken != nil {
			controller.Unauthorized(c, http.StatusForbidden, model.ErrForbidden)
			c.Abort()
			return
		}

		// access token の取得
		if errAccessToken == nil {
			oldAccessTokenClaims = oldAccessToken.Claims.(jwt.MapClaims)
			oldAccessTokenID = oldAccessTokenClaims[config.IdentityKeyAccessToken()].(string)
			oldSession, err = mw.ss.GetByID(oldAccessTokenID)
			if err != nil {
				controller.Unauthorized(c, http.StatusForbidden, model.ErrForbidden)
				c.Abort()
				return
			}
			oldSessionExpired = oldSession.IsExpired()
		}

		// remember me token の取得
		if errRememberMeToken == nil {
			oldRememberMeTokenClaims = oldRememberMeToken.Claims.(jwt.MapClaims)
			oldRememberMeTokenID = oldRememberMeTokenClaims[config.IdentityKeyAccessToken()].(string)
			oldRememberMeSession, err = mw.rs.GetByID(oldRememberMeTokenID)
			if err != nil {
				controller.Unauthorized(c, http.StatusForbidden, model.ErrForbidden)
				c.Abort()
				return
			}
			oldRememberMeSessionExpired = oldRememberMeSession.IsExpired()
		}

		// remember me token が設定されておらず access token が失効している場合
		if errAccessToken == nil && errRememberMeToken != nil && oldSessionExpired {
			if err := mw.ss.DeleteByID(oldAccessTokenID); err != nil {
				controller.Unauthorized(c, http.StatusUnauthorized, model.ErrExpiredToken)
				c.Abort()
				return
			}
			controller.Unauthorized(c, http.StatusUnauthorized, model.ErrExpiredToken)
			c.Abort()
			return
		}

		// access token が設定されておらず remember me token が失効している場合
		if errAccessToken != nil && errRememberMeToken == nil && oldRememberMeSessionExpired {
			fmt.Println("4")
			if err := mw.rs.DeleteByID(oldRememberMeTokenID); err != nil {
				controller.Unauthorized(c, http.StatusUnauthorized, model.ErrExpiredToken)
				c.Abort()
				return
			}
			c.SetCookie(config.CookieNameRememberMeToken(), "", -1, "/", "", false, true)
			controller.Unauthorized(c, http.StatusUnauthorized, model.ErrExpiredToken)
			c.Abort()
			return
		}

		// access token と remember me token が失効している場合
		if errAccessToken == nil && errRememberMeToken == nil && oldSessionExpired && oldRememberMeSessionExpired {
			if err := mw.as.Delete(oldAccessTokenID, oldRememberMeTokenID); err != nil {
				controller.Unauthorized(c, http.StatusUnauthorized, model.ErrExpiredToken)
				c.Abort()
				return
			}
			c.SetCookie(config.CookieNameRememberMeToken(), "", -1, "/", "", false, true)
			controller.Unauthorized(c, http.StatusUnauthorized, model.ErrExpiredToken)
			c.Abort()
			return
		}

		newAccessTokenID, newAccessToken, err := controller.GenerateAccessToken()
		if err != nil {
			controller.Unauthorized(c, http.StatusUnauthorized, err)
			c.Abort()
			return
		}
		if err := mw.ss.Update(oldAccessTokenID, newAccessTokenID, config.TimeFunc().Add(config.TimeoutAccessToken())); err != nil {
			controller.Unauthorized(c, http.StatusUnauthorized, err)
			c.Abort()
			return
		}
		c.Header("Authorization", config.TokenHeadName()+" "+newAccessToken)

		if errRememberMeToken == nil {
			newRememberMeTokenID, newRememberMeToken, err := controller.GenerateRememberMeToken()
			if err != nil {
				controller.Unauthorized(c, http.StatusUnauthorized, err)
				return
			}
			if err := mw.rs.CreateOrUpdate(oldRememberMeSession.UserID, newRememberMeTokenID, config.TimeFunc().Add(config.TimeoutRememberMeToken())); err != nil {
				controller.Unauthorized(c, http.StatusUnauthorized, err)
				return
			}
			c.SetCookie(config.CookieNameRememberMeToken(), newRememberMeToken, config.MaxAgeRememberMeToken(), "/", "", false, true)
		}

		c.Next()
	}
}
