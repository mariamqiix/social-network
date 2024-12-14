package middleware

import (
	"encoding/json"
	"fmt"
	// "fmt"
	"net/http"
	"strings"

	"backend/pkg/models"
	"backend/pkg/structs"
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

func UserResponds(w http.ResponseWriter, r *http.Request) {
	user := GetUser(r)

	if user == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get the path parameter from the URL
	path := strings.TrimPrefix(r.URL.Path, "/user/responds/")
	id := r.URL.Query().Get("id")
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
		invites, err := models.GetUserGroupInvites(user.ID, groupInviteResponse.GroupID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		models.DeleteNotificationByGroupRequest(user.ID,groupInviteResponse.GroupID,"GroupInvite")
		if groupInviteResponse.Response == "Accept" {
			err := models.AddMember(groupInviteResponse.GroupID, user.ID)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
				return
			}
			notificationType = "GroupInviteAccept"
			code = "accepted"
			for _, invite := range invites {
				models.UpdateInviteStatus(invite.ID, user.ID, "Accepted")
			}
		}
		notification := structs.Notification{
			UserID:           group.CreatorID,
			SenderID:         &user.ID,
			NotificationType: notificationType,
			GroupID:          &group.ID,
			IsRead:           false,
		}

		models.CreateGroupsNotification(notification)
		notificate, err := createGroupNotificationRequestResponse(notification, code)
		if err != nil {
			return
		}

		SendNotification(group.CreatorID, *notificate)

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
			models.AddMember(GroupRequestResponse.GroupID, GroupRequestResponse.UserID)
			notificationType = "GroupRequestAccept"
			code = "approved"
		}

		models.RemoveRequest(GroupRequestResponse.GroupID, GroupRequestResponse.UserID)
		models.DeleteNotificationByGroupRequest(user.ID,GroupRequestResponse.GroupID,"GroupRequestToJoin")

		notification := structs.Notification{
			UserID:           GroupRequestResponse.UserID,
			SenderID:         &group.CreatorID,
			NotificationType: notificationType,
			GroupID:          &GroupRequestResponse.GroupID,
			IsRead:           false,
		}

		models.CreateGroupsNotification(notification)
		notificate, err := createGroupNotificationRequestResponse(notification, code)
		if err != nil {
			return
		}

		SendNotification(GroupRequestResponse.UserID, *notificate)

	case "followResponse":

		var userRequestedToFollow *structs.UserInfoRequest
		status := "Accepted"
		notificationType := "followRequestAccept"
		code := 2

		err := json.NewDecoder(r.Body).Decode(&userRequestedToFollow)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if userRequestedToFollow.Response == "Reject" {
			models.DeleteFollower(structs.Follower{
				FollowingID: user.ID,
				FollowerID:  userRequestedToFollow.UserID,
			})
			notificationType = "followRequestReject"
			code = 1

		} else {
			models.UpdateFollowerStatues(structs.Follower{
				FollowingID: user.ID,
				FollowerID:  userRequestedToFollow.UserID,
				Status:      &status,
			})
		}

		notification := structs.Notification{
			UserID:           userRequestedToFollow.UserID,
			SenderID:         &user.ID,
			NotificationType: notificationType,
			IsRead:           false,
		}

		notificate, err := createFollowNotificationResponse(notification, code)
		if err != nil {
			return
		}

		models.CreateMessagesNotification(notification)
		SendNotification(userRequestedToFollow.UserID, *notificate)
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
			status = "Accepted"
			notificationType = "startFollow"
			code = 3
		}

		followings, err := models.GetFollowings(user.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		for _, user := range followings {
			if user.FollowingID == userToFollow.ID {
				return
			}
		}

		models.CreateFollower(structs.Follower{
			FollowingID: userToFollow.ID,
			FollowerID:  user.ID,
			Status:      &status,
		})

		notification := structs.Notification{
			UserID:           userToFollow.ID,
			SenderID:         &user.ID,
			NotificationType: notificationType,
			IsRead:           false,
		}

		notificate, err := createFollowNotificationResponse(notification, code)
		if err != nil {
			return
		}

		models.CreateMessagesNotification(notification)

		SendNotification(userToFollow.ID, *notificate)

		writeToJson(
			structs.StatusResponse{
				Status: status,
			}, w)

	case "requestToUnfollow":
		var userRequestToUnfollow *structs.UserInfoRequest

		err := json.NewDecoder(r.Body).Decode(&userRequestToUnfollow)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		userToFollow, err := models.GetUserByID(userRequestToUnfollow.UserID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		models.DeleteNotificationByFollowRequest(user.ID,userToFollow.ID,"followRequest")



		models.DeleteFollower(structs.Follower{
			FollowingID: userToFollow.ID,
			FollowerID:  user.ID,
		})

	default:
		http.NotFound(w, r)
	}

	if id != "" {
		err := models.Delete("UserNotification", []string{"id"}, []interface{}{id})
		if err != nil {
			fmt.Println(err)
		}
	}
}
