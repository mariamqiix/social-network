package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

func NotificationsHandler(w http.ResponseWriter, r *http.Request) {
	user := GetUser(r)

	if user == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

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
	default:
		http.NotFound(w, r)
	}

}

func UserResponde(w http.ResponseWriter, r *http.Request) {
	user := GetUser(r)

	if user == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get the path parameter from the URL
	path := strings.TrimPrefix(r.URL.Path, "/user/responde/")

	// Handle the different cases based on the path
	switch path {
	case "groupInviteResponse":

		// Unmarshal the JSON data into a GroupResponse struct
		var groupInviteResponse structs.GroupInviteResponse 
		err := json.NewDecoder(r.Body).Decode(&groupInviteResponse)

		if err != nil {
			log.Fatalf("Error unmarshalling JSON: %v", err)
		}

		models.RemoveInvite(user.ID, groupInviteResponse.GroupID)
		if (groupInviteResponse.Response == "Accept"){
			models.AddMember(user.ID, groupInviteResponse.GroupID)
		}

	case "adminGroupRequestResponse":
		w.Write([]byte("Returning notifications of the admin group request response"))

	case "followResponse":
		w.Write([]byte("Returning notifications of the follow response"))

	default:
		http.NotFound(w, r)
	}
}
