package middleware

import (
	"backend/pkg/models"
	"fmt"
	"log"
	"net/http"
	"strings"
)

func NotificationsHandler(w http.ResponseWriter, r *http.Request) {
	user := GetUser(r)
	limiterUsername := "[GUESTS]"
	if user != nil {
		limiterUsername = user.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	fmt.Println(user.ID);

	// Get the path parameter from the URL
	path := strings.TrimPrefix(r.URL.Path, "/user/notifications/")

	// Handle the different cases based on the path
	switch path {
	case "":
		notifications, err := models.GetUserNotifications(user.ID)
		if err != nil {
			log.Printf("error getting notifications: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		notificationsRespone := MapNotifications(*user, notifications)
		writeToJson(notificationsRespone, w)

	case "groupInviteResponse":
		w.Write([]byte("Returning notifications of the group invite response"))
		// groupID := r.
		// models.RemoveInvite(user.ID)
	case "adminGroupRequestResponse":
	    w.Write([]byte("Returning notifications of the admin group request response"))

	case "followResponse":
	    w.Write([]byte("Returning notifications of the follow response"))

	default:
		http.NotFound(w, r)
	}

}
