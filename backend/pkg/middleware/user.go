package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"backend/pkg/models"
	"backend/pkg/structs"
)

func PrivacyChangeHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"

	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !UserLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	var userChangeRequest *structs.UserChangeRequest

	err := json.NewDecoder(r.Body).Decode(&userChangeRequest)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	profileUserId := userChangeRequest.UserID
	if userChangeRequest.UserID == -1 && sessionUser != nil {
		profileUserId = sessionUser.ID
	}

	userProfile, err := models.GetUserByID(profileUserId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	if sessionUser.ID != userProfile.ID {
		errorServer(w, http.StatusUnauthorized)
		return
	} else if userChangeRequest.Privacy != "Public" && userChangeRequest.Privacy != "Private" {
		errorServer(w, http.StatusBadRequest)
		return
	}

	userProfile.ProfileType = userChangeRequest.Privacy
	models.UpdateUser(*userProfile)
	errorServer(w, http.StatusOK)
}
func ProfilePageHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the endpoint from the request path
	path := strings.TrimPrefix(r.URL.Path, "/user/profile/")

	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	isUserProfile := false
	canSeeInfo := ""

	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !UserLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}

	var userProfileRequest *structs.UserInfoRequest

	err := json.NewDecoder(r.Body).Decode(&userProfileRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	profileUserId := userProfileRequest.UserID
	if userProfileRequest.UserID == -1 && sessionUser != nil {
		profileUserId = sessionUser.ID
	}

	if profileUserId == sessionUser.ID {
		isUserProfile = true
	}

	userProfile, err := models.GetUserByID(profileUserId)
	if err != nil {
		fmt.Print("wef")
		errorServer(w, http.StatusInternalServerError)
		return
	}

	requestUserId := -1
	if sessionUser != nil {
		requestUserId = sessionUser.ID
	}

	UserPosts, err := returnProfilePosts("", profileUserId, requestUserId, sessionUser)
	if err != nil {
		fmt.Print("wdddddef")

		errorServer(w, http.StatusInternalServerError)
		return
	}

	UserLikedPost, err := returnProfilePosts("like", profileUserId, requestUserId, sessionUser)
	if err != nil {
		fmt.Print("hello")

		errorServer(w, http.StatusInternalServerError)
		return
	}

	UserDislikedPost, err := returnProfilePosts("dislike", profileUserId, requestUserId, sessionUser)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	followings, err := models.GetFollowings(userProfile.ID)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	followingsStruct, err := mapBasicUsers(followings, 1)
	if err != nil {
		fmt.Print("hdddddello")

		errorServer(w, http.StatusInternalServerError)
		return
	}

	followers, err := models.GetFollowers(userProfile.ID)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	followersStruct, err := mapBasicUsers(followers, 2)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	if requestUserId != -1 {
		// for _, user := range followings {
		// 	if user.FollowingID == requestUserId {
		// 		canSeeInfo = *user.Status
		// 		break
		// 	}
		// }

		for _, user := range followers {
			if user.FollowerID == requestUserId && canSeeInfo != "Accept" {
				canSeeInfo = *user.Status
				break
			}
		}
	}

	profile := structs.ProfileResponse{
		User: structs.UserResponse{
			Id:          userProfile.ID,
			Username:    userProfile.Username,
			Nickname:    *userProfile.Nickname,
			Email:       userProfile.Email,
			FirstName:   userProfile.FirstName,
			LastName:    userProfile.LastName,
			DateOfBirth: userProfile.DateOfBirth,
			Bio:         *userProfile.Bio,
			Image:       GetImageData(userProfile.ImageID),
		},
		Followigs:        followingsStruct,
		Followers:        followersStruct,
		UserPosts:        UserPosts,
		UserLikedPost:    UserLikedPost,
		UserDislikedPost: UserDislikedPost,
		IsUserProfile:    isUserProfile,
		UserStatus:       canSeeInfo,
		UserProfiletype:  userProfile.ProfileType,
	}

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
		writeToJson(followingsStruct, w)
		return

	case "followers":
		writeToJson(followingsStruct, w)
		return

	default:
		http.Error(w, "Invalid endpoint", http.StatusNotFound)
	}
}

func returnProfilePosts(mode string, profileUserId int, sessionUserID int, sessionUser *structs.User) ([]structs.PostResponse, error) {
	var posts []structs.Post
	var err error
	if mode == "like" {
		posts, err = models.GetPostsByReaction(profileUserId, sessionUserID, "Like")
		if err != nil {
			return []structs.PostResponse{}, err
		}

	} else if mode == "dislike" {
		posts, err = models.GetPostsByReaction(profileUserId, sessionUserID, "Disike")
		if err != nil {
			return []structs.PostResponse{}, err
		}

	} else {
		posts, err = models.ProfilePagePosts(profileUserId, sessionUserID)
		fmt.Print(posts)
		if err != nil {
			return []structs.PostResponse{}, err
		}
	}

	return mapPosts(sessionUser, posts), nil
}

func mapBasicUsers(followers []structs.Follower, code int) ([]structs.BasicUserResponse, error) {
	var basicUsers []structs.BasicUserResponse
	var user *structs.User
	var err error
	for _, followee := range followers {
		if code == 1 {
			user, err = models.GetUserByID(followee.FollowingID)
			if err != nil {
				return nil, err
			}
		} else if code == 2 {
			user, err = models.GetUserByID(followee.FollowerID)
			if err != nil {
				return nil, err
			}
		}
		basicUsers = append(basicUsers,
			structs.BasicUserResponse{
				Id:       user.ID,
				Username: user.Username,
				Nickname: *user.Nickname,
				Image:    GetImageData(user.ImageID),
			},
		)
	}
	return basicUsers, nil
}

func ListUsersHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"

	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !UserLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	users, err := models.GetAllUsers()

	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	writeToJson(users, w)
}
