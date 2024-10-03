package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func ProfilePageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	var userProfile *structs.User
	privcay := ""

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

	// if userProfileRequest.UserID == -1 && sessionUser != nil {
	// 	userProfile = sessionUser
	// } else {
	userProfile, err = models.GetUserByID(userProfileRequest.UserID)
	if err != nil {
		log.Printf("error getting user: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	// }

	profile := structs.ProfileResponse{
		Id:              userProfile.ID,
		Username:        userProfile.Username,
		Nickname:        *userProfile.Nickname,
		Email:           userProfile.Email,
		FirstName:       userProfile.FirstName,
		LastName:        userProfile.LastName,
		DateOfBirth:     userProfile.DateOfBirth,
		Bio:             *userProfile.Bio,
		Image:           GetImageData(userProfile.ImageID),
		UserPosts:       []structs.Post{},
		UserLikedPost:   []structs.Post{},
		UserDislikedPst: []structs.Post{},
	}

	if sessionUser == nil && userProfile.ProfileType == "Private" {
		writeToJson(profile, w)
		return
	} else if sessionUser == nil && userProfile.ProfileType == "Public" {
		privcay = "Public"
	}

	if sessionUser != nil && sessionUser != userProfile {
		canSee, err := models.CheckIfUserFollows(userProfileRequest.UserID, sessionUser.ID)
		if err != nil {
			log.Printf("error getting user fllowers: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}

		if !canSee {
			writeToJson(profile, w)
			return
		}
	}

	if sessionUser == userProfile {

	}

	view := ProfilePageView{
		User:          ReturnUserResponse(sessionUser),
		ProfileUser:   ReturnUserResponse(User),
		Posts:         mapPosts(sessionUser, Posts),
		LikedPosts:    mapPosts(sessionUser, likedPosts),
		DislikedPosts: mapPosts(sessionUser, DisLikePosts),
	}

	// Extract the endpoint from the request path
	path := strings.TrimPrefix(r.URL.Path, "/user/profile/")

	switch path {
	case "":

	case "followers":
		// Handle the /followers endpoint
		fmt.Fprintf(w, "Handling Followers Page")
	case "following":
		// Handle the /following endpoint
		fmt.Fprintf(w, "Handling Following Page")
	default:
		http.Error(w, "Invalid endpoint", http.StatusNotFound)
	}

}

func profileHelper(w http.ResponseWriter, r *http.Request) {

	profileUser, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error getting id: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}

	privcay := ""
	var User *structs.User

	writeToJson(view, w)
	return

}

func try(w http.ResponseWriter, user structs.User) {
	posts, err := models.GetUserPosts("", user.ID)
	if err != nil {
		log.Printf("error getting posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}

	likedPosts, err := models.GetPostsByReaction(user.ID, user.ID, "Like")
	if err != nil {
		log.Printf("error getting liked posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}

	DisLikePosts, err := models.GetPostsByReaction(user.ID, user.ID, "Disike")
	if err != nil {
		log.Printf("error getting liked posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}

	view := ProfilePageView{
		User:          ReturnUserResponse(user),
		ProfileUser:   ReturnUserResponse(user),
		Posts:         mapPosts(user, posts),
		LikedPosts:    mapPosts(user, likedPosts),
		DislikedPosts: mapPosts(user, DisLikePosts),
	}

	return
}

func returnProfilePosts(mode string, profileUserId int, sessionUserID int) ([]structs.Post, err) {
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
