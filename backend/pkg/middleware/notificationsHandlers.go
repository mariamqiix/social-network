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
		notificationsRespone, err := MapNotifications(*user, notifications)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
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

		notificationType := "GroupInviteReject"
		code := "rejected"

		// Unmarshal the JSON data into a GroupResponse struct
		var groupInviteResponse structs.GroupInviteResponse

		err := json.NewDecoder(r.Body).Decode(&groupInviteResponse)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
		}

		group, err := models.GetGroupByID(groupInviteResponse.GroupID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		models.RemoveInvite(group.ID, user.ID)

		if groupInviteResponse.Response == "Accept" {
			models.AddMember(user.ID, groupInviteResponse.GroupID)
			notificationType = "GroupInviteAccept"
			code = "accepted"
		}

		notification := structs.Notification{
			UserID:           group.CreatorID,
			SenderID:         &user.ID,
			NotificationType: notificationType,
			GroupID:          &group.ID,
			IsRead:           false,
		}

		models.CreateMessagesNotification(notification)
		notificate, err := createGroupNotificationRequestResponse(notification, code)
		if err != nil {
			return
		}

		SendNotification(user.ID, *notificate)

	case "adminGroupRequestResponse":

		notificationType := "GroupRequestReject"
		code := "rejected"

		// Unmarshal the JSON data into a GroupResponse struct
		var GroupRequestResponse structs.GroupRequestResponse

		err := json.NewDecoder(r.Body).Decode(&GroupRequestResponse)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
		}

		group, err := models.GetGroupByID(GroupRequestResponse.GroupID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		if GroupRequestResponse.Response == "Accept" {
			models.AddMember(user.ID, GroupRequestResponse.GroupID)
			notificationType = "GroupRequestAccept"
			code = "approved"
		}

		models.RemoveRequest(GroupRequestResponse.GroupID, GroupRequestResponse.UserID)

		notification := structs.Notification{
			UserID:           user.ID,
			SenderID:         &group.CreatorID,
			NotificationType: notificationType,
			GroupID:          &GroupRequestResponse.GroupID,
			IsRead:           false,
		}

		models.CreateMessagesNotification(notification)
		notificate, err := createGroupNotificationRequestResponse(notification, code)
		if err != nil {
			return
		}

		SendNotification(user.ID, *notificate)

	case "followResponse":

		var userRequestToFollow *structs.UserInfoRequest
		status := "Accept"
		notificationType := "followRequestAccept"
		code := 2

		err := json.NewDecoder(r.Body).Decode(&userRequestToFollow)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if userRequestToFollow.Response == "Reject" {
			models.DeleteFollower(structs.Follower{
				FollowingID: user.ID,
				FollowerID:  userRequestToFollow.UserID,
			})
			notificationType = "followRequestReject"
			code = 1

		} else {
			models.UpdateFollowerStatues(structs.Follower{
				FollowingID: user.ID,
				FollowerID:  userRequestToFollow.UserID,
				Status:      &status,
			})
		}

		notification := structs.Notification{
			UserID:           user.ID,
			SenderID:         &userRequestToFollow.UserID,
			NotificationType: notificationType,
			IsRead:           false,
		}

		notificate, err := createFollowNotificationResponse(notification, code)
		if err != nil {
			return
		}

		models.CreateMessagesNotification(notification)
		SendNotification(user.ID, *notificate)

	case "requestToFollow":
		var userRequestToFollow *structs.UserInfoRequest
		status := "Pending"
		notificationType := "followRequest"
		code := 4

		err := json.NewDecoder(r.Body).Decode(&userRequestToFollow)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		userToFollow, err := models.GetUserByID(userRequestToFollow.UserID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		if userToFollow.ProfileType == "Public" {
			status = "Accept"
			notificationType = "startFollow"
			code = 3
		}

		models.CreateFollower(structs.Follower{
			FollowingID: user.ID,
			FollowerID:  userRequestToFollow.UserID,
			Status:      &status,
		})

		notification := structs.Notification{
			UserID:           user.ID,
			SenderID:         &userRequestToFollow.UserID,
			NotificationType: notificationType,
			IsRead:           false,
		}

		notificate, err := createFollowNotificationResponse(notification, code)
		if err != nil {
			return
		}

		models.CreateMessagesNotification(notification)

		SendNotification(user.ID, *notificate)

	default:
		http.NotFound(w, r)
	}
}
