package middleware

import (
	"backend/pkg/models"
	"log"
	"net/http"
)

func UserNotificationsHandlers(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	notifications, err := models.GetUserNotifications(sessionUser.ID)
	if err != nil {
		log.Printf("error getting notifications: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	notificationsRespone := mapNotifications(*sessionUser, notifications)
	writeToJson(notificationsRespone, w)
}
