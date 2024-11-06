package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"fmt"
	"net/http"
)

func UserChatHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !userLimiter.Allow(limiterUsername) {
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

	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	followers, _ := models.GetFollowers(user.ID) 
	following, _ := models.GetFollowings(user.ID)

	// Map to store unique entries based on the composite key
	uniqueFollowers := make(map[string]structs.Follower)

	// Add followers to the map
	for _, follower := range followers {
		key := fmt.Sprintf("%d-%d", follower.FollowingID, follower.FollowerID)
		uniqueFollowers[key] = follower
	}

	// Add following to the map
	for _, follower := range following {
		key := fmt.Sprintf("%d-%d", follower.FollowingID, follower.FollowerID)
		if _, ok := uniqueFollowers[key]; !ok {
			uniqueFollowers[key] = follower
		}
	}

	// Convert the map back to a slice
	var uniqueFollowersSlice []structs.Follower
	for _, follower := range uniqueFollowers {
		uniqueFollowersSlice = append(uniqueFollowersSlice, follower)
	}

	// Print unique followers and following
	// for _, follower := range uniqueFollowersSlice {
	// 	fmt.Printf("ID: %d, FollowingID: %d, FollowerID: %d, Status: %v\n", follower.ID, follower.FollowingID, follower.FollowerID, follower.Status)
	// }

}

func UserChatsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
}