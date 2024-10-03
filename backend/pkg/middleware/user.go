package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"log"
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
		log.Fatalf("Error unmarshalling JSON: %v", err)
	}

	userProfile, err := models.GetUserByID(userProfileRequest.UserID)
	if err != nil {
		log.Printf("error getting user: %s\n", err.Error())
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

	if sessionUser != nil {
		// canSee, err := models.CheckIfUserFollows(userProfileRequest.UserID, sessionUser.ID)
		// if err != nil {
		// 	log.Printf("error getting user fllowers: %s\n", err.Error())
		// 	errorServer(w, http.StatusInternalServerError)
		// 	return
		// }

		// if !canSee {
		// 	writeToJson(profile, w)
		// 	return
		// }

		profile.UserPosts, err = returnProfilePosts("", sessionUser.ID, sessionUser.ID)
		if err != nil {
			log.Printf("error getting user posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}

		profile.UserLikedPost, err = returnProfilePosts("like", sessionUser.ID, sessionUser.ID)
		if err != nil {
			log.Printf("error getting user posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}

		profile.UserDislikedPost, err = returnProfilePosts("dislike", sessionUser.ID, sessionUser.ID)
		if err != nil {
			log.Printf("error getting user posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}

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
			log.Printf("error getting user followings: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		writeToJson(following, w)
		return

	case "followers":
		followers, err := models.GetFollowers(userProfile.ID)
		if err != nil {
			log.Printf("error getting user followers: %s\n", err.Error())
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
		// Posts, err = models.GetUserPosts(privcay, profileUser)
		// if err != nil {
		// 	return []structs.Post{}, err
		// }
	}

	return posts, nil
}
