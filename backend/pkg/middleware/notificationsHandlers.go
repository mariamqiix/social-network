package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
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
			http.Error(w, "Invalid request body", http.StatusBadRequest)
		}

		models.RemoveInvite(user.ID, groupInviteResponse.GroupID)
		if groupInviteResponse.Response == "Accept" {
			models.AddMember(user.ID, groupInviteResponse.GroupID)
		}

	case "adminGroupRequestResponse":
		// Unmarshal the JSON data into a GroupResponse struct
		var GroupRequestResponse structs.GroupRequestResponse

		err := json.NewDecoder(r.Body).Decode(&GroupRequestResponse)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
		}

		if GroupRequestResponse.Response == "Accept" {
			models.AddMember(user.ID, GroupRequestResponse.GroupID)
		}

		models.RemoveRequest(GroupRequestResponse.GroupID, GroupRequestResponse.UserID)

	case "followResponse":
		var userRequestToFollow *structs.UserInfoRequest

		err := json.NewDecoder(r.Body).Decode(&userRequestToFollow)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		models.CreateFollower(structs.Follower{
			FollowingID: user.ID,
			FollowerID:  userRequestToFollow.UserID,
		})

	case "requestToFollow":
		var userRequestToFollow *structs.UserInfoRequest

		err := json.NewDecoder(r.Body).Decode(&userRequestToFollow)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		models.CreateFollower(structs.Follower{
			FollowingID: user.ID,
			FollowerID:  userRequestToFollow.UserID,
		})

	default:
		http.NotFound(w, r)
	}
}
