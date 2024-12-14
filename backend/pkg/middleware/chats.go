package middleware

import (
	"net/http"

	"backend/pkg/models"
	"backend/pkg/structs"
)

func UserChatHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !UserLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	chatUser := r.URL.Query().Get("Username")
	ChatId, err := models.GetUserIdByUsername(chatUser)
	if err != nil {
		errorServer(w, http.StatusBadRequest)
		return
	}

	Messages, err := models.GetUserMessages(
		sessionUser.ID,
		ChatId,
	)

	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	view := ChatPageView{
		User:     ReturnUserResponse(sessionUser),
		Messages: mapMessages(Messages),
	}

	writeToJson(view, w)
}

func UserAbleToChatHandler(w http.ResponseWriter, r *http.Request) {
	user := GetUser(r)
	limiterUsername := "[GUESTS]"
	if user != nil {
		limiterUsername = user.Username
	}

	if !UserLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	followers1, _ := models.GetFollowers(user.ID)
	following2, _ := models.GetFollowings(user.ID)
	followers, _ := mapBasicUsers(followers1, 2)
	following, _ := mapBasicUsers(following2, 1)

	var users []structs.BasicUserResponse
	users = append(users, followers...)

	for _, followee := range following {
		if !contains(users, followee) {
			users = append(users, followee)
		}
	}
	writeToJson(users, w)
}

// contains checks if a slice of BasicUserResponse contains a specific BasicUserResponse
func contains(users []structs.BasicUserResponse, user structs.BasicUserResponse) bool {
	for _, u := range users {
		if u.Id == user.Id {
			return true
		}
	}
	return false
}
