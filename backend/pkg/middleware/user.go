package middleware

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"backend/pkg/models"
	"backend/pkg/structs"
)

func PrivacyChangeHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"

	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !userLimiter.Allow(limiterUsername) {
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

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	limiterUsername := "[GUESTS]"
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	var userRequest *structs.UserRquest
	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	hashedPassword, erro := GetHash(userRequest.Password)
	if erro != HasherErrorNone {
		fmt.Println(erro)
		errorServer(w, http.StatusInternalServerError)
		return
	}

	dob, err := time.Parse("2006-01-02", userRequest.DateOfBirth)
	if err != nil {
		fmt.Println(err)
		errorServer(w, http.StatusInternalServerError)
		return
	}
	imageID := -1
	if userRequest.Image != nil {
		imageBytes, err := base64.StdEncoding.DecodeString(*userRequest.Image)
		if err != nil {
			fmt.Println("Error decoding base64 image:", err)
			errorServer(w, http.StatusBadRequest)
			return
		}
		isImage, _ := IsDataImage(imageBytes)
		if isImage {
			imageID, err = models.UploadImage(imageBytes)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
				return
			}
		}
	}

	user := structs.User{
		Username:       userRequest.Username,
		UserType:       "member",
		ProfileType:    userRequest.ProfileType,
		Email:          userRequest.Email,
		HashedPassword: hashedPassword,
		FirstName:      userRequest.FirstName,
		LastName:       userRequest.LastName,
		DateOfBirth:    dob,
		ImageID:        &imageID,
		Bio:            &userRequest.Bio,
		Nickname:       &userRequest.Nickname,
	}
	err = models.CreateUser(user)
	if err != nil {
		fmt.Println(err)
		if err.Error() == "UNIQUE constraint failed: User.email" {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, "User already exists")
		} else {
			errorServer(w, http.StatusInternalServerError)
		}
		return
	}
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

	if !userLimiter.Allow(limiterUsername) {
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
		errorServer(w, http.StatusInternalServerError)
		return
	}

	requestUserId := -1
	if sessionUser != nil {
		requestUserId = sessionUser.ID
	}

	UserPosts, err := returnProfilePosts("", profileUserId, requestUserId, sessionUser)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	UserLikedPost, err := returnProfilePosts("like", profileUserId, requestUserId, sessionUser)
	if err != nil {
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
		for _, user := range followings {
			if user.FollowingID == requestUserId {
				canSeeInfo = *user.Status
				break
			}
		}

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

	if !userLimiter.Allow(limiterUsername) {
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
