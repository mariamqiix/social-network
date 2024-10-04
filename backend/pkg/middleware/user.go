package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func ProfilePageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"

	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	var userProfileRequest *structs.UserInfoRequest

	err := json.NewDecoder(r.Body).Decode(&userProfileRequest)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	profileUserId := userProfileRequest.UserID
	if userProfileRequest.UserID == -1 && sessionUser != nil {
		profileUserId = sessionUser.ID
	}

	fmt.Println(profileUserId)

	userProfile, err := models.GetUserByID(profileUserId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	profile := structs.ProfileResponse{
		Id:               userProfile.ID,
		Username:         userProfile.Username,
		Nickname:         *userProfile.Nickname,
		Email:            userProfile.Email,
		FirstName:        userProfile.FirstName,
		LastName:         userProfile.LastName,
		DateOfBirth:      userProfile.DateOfBirth,
		Bio:              *userProfile.Bio,
		Image:            GetImageData(userProfile.ImageID),
		UserPosts:        []structs.Post{},
		UserLikedPost:    []structs.Post{},
		UserDislikedPost: []structs.Post{},
	}

	if sessionUser == nil && userProfile.ProfileType == "Private" {
		writeToJson(profile, w)
		return
	}

	requestUserId := 0
	if sessionUser == nil {
		requestUserId = -1
	} else {
		requestUserId = sessionUser.ID
	}

	profile.UserPosts, err = returnProfilePosts("", profileUserId, requestUserId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
	fmt.Print(profile.UserPosts)

	profile.UserLikedPost, err = returnProfilePosts("like", profileUserId, requestUserId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	profile.UserDislikedPost, err = returnProfilePosts("dislike", profileUserId, requestUserId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	// Extract the endpoint from the request path
	path := strings.TrimPrefix(r.URL.Path, "/user/profile/")

	switch path {
	case "":
		writeToJson(profile, w)
		return

	case "like":
		writeToJson(profile.UserLikedPost, w)
		return

	case "dislike":
		writeToJson(profile.UserDislikedPost, w)
		return

	case "following":
		following, err := models.GetFollowings(userProfile.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
		writeToJson(following, w)
		return

	case "followers":
		followers, err := models.GetFollowers(userProfile.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
		writeToJson(followers, w)
		return

	default:
		http.Error(w, "Invalid endpoint", http.StatusNotFound)
	}
}

func returnProfilePosts(mode string, profileUserId int, sessionUserID int) ([]structs.Post, error) {
	var posts []structs.Post
	var err error
	if mode == "like" {
		posts, err = models.GetPostsByReaction(profileUserId, sessionUserID, "Like")
		if err != nil {
			return []structs.Post{}, err
		}

	} else if mode == "dislike" {
		posts, err = models.GetPostsByReaction(profileUserId, sessionUserID, "Disike")
		if err != nil {
			return []structs.Post{}, err
		}

	} else {
		posts, err = models.ProfilePagePosts(profileUserId, sessionUserID)
		if err != nil {
			return []structs.Post{}, err
		}
	}

	return posts, nil
}
