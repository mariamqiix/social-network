package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"log"
	"net/http"
	"strconv"
)

func ProfilePageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	profileUser, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error getting id: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if profileUser == -1 && sessionUser != nil {
		posts, err := models.GetUserPosts("", sessionUser.ID)
		if err != nil {
			log.Printf("error getting posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		followers, err := models.GetFollowers(sessionUser.ID)
		if err != nil {
			log.Printf("error getting followers: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		following, err := models.GetFollowings(sessionUser.ID)
		if err != nil {
			log.Printf("error getting following: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		likedPosts, err := models.GetPostsByReaction(sessionUser.ID, sessionUser.ID, "Like")
		if err != nil {
			log.Printf("error getting liked posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		DisLikePosts, err := models.GetPostsByReaction(sessionUser.ID, sessionUser.ID, "Disike")
		if err != nil {
			log.Printf("error getting liked posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		view := ProfilePageView{
			User:          ReturnUserResponse(sessionUser),
			ProfileUser:   ReturnUserResponse(sessionUser),
			Posts:         mapPosts(sessionUser, posts),
			LikedPosts:    mapPosts(sessionUser, likedPosts),
			DislikedPosts: mapPosts(sessionUser, DisLikePosts),
			Followers:     mapUsers(followers),
			Following:     mapUsers(following),
		}
		writeToJson(view, w)
		return

	}

	User, err := models.GetUserByID(profileUser)
	if err != nil {
		log.Printf("error getting user: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	followers, err := models.GetFollowers(profileUser)
	if err != nil {
		log.Printf("error getting followers: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	following, err := models.GetFollowings(profileUser)
	if err != nil {
		log.Printf("error getting following: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if limiterUsername == "[GUESTS]" {
		Posts, err := models.GetUserPosts("Public", profileUser)
		if err != nil {
			log.Printf("error getting posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		likedPosts, err := models.GetPostsByReaction(profileUser, -1, "Like")
		if err != nil {
			log.Printf("error getting liked posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		DisLikePosts, err := models.GetPostsByReaction(profileUser, -1, "Disike")
		if err != nil {
			log.Printf("error getting liked posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		view := ProfilePageView{
			User:          ReturnUserResponse(sessionUser),
			ProfileUser:   ReturnUserResponse(User),
			Posts:         mapPosts(sessionUser, Posts),
			LikedPosts:    mapPosts(sessionUser, likedPosts),
			DislikedPosts: mapPosts(sessionUser, DisLikePosts),
			Followers:     mapUsers(followers),
			Following:     mapUsers(following),
		}
		writeToJson(view, w)
		return
	}
	Posts, err := models.ProfilePagePosts(profileUser, sessionUser.ID)
	if err != nil {
		log.Printf("error getting posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	likedPosts, err := models.GetPostsByReaction(profileUser, sessionUser.ID, "Like")
	if err != nil {
		log.Printf("error getting liked posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	DisLikePosts, err := models.GetPostsByReaction(profileUser, sessionUser.ID, "Disike")
	if err != nil {
		log.Printf("error getting liked posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	view := ProfilePageView{
		User:          ReturnUserResponse(sessionUser),
		ProfileUser:   ReturnUserResponse(User),
		Posts:         mapPosts(sessionUser, Posts),
		LikedPosts:    mapPosts(sessionUser, likedPosts),
		DislikedPosts: mapPosts(sessionUser, DisLikePosts),
		Followers:     mapUsers(followers),
		Following:     mapUsers(following),
	}
	writeToJson(view, w)
}

func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.ContentLength > 1024 {
		http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
		return
	}
	var user *structs.User
	var err error
	Username := r.FormValue("username")
	Password := r.FormValue("password")
	// check if the email is valid and exists
	if IsValidEmail(Username) {
		exist, err := models.CheckExistance("User", []string{"email"}, []interface{}{Username})
		if err != nil {
			log.Printf("loginPostHandler: %s\n", err.Error())
			http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
			return
		} else if !exist {
			http.Error(w, "Invalid username or email or password", http.StatusConflict)
			return
		}
		user, err = models.GetUserByEmail(Username)
		if err != nil {
			http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
			return
		}
	} else {
		user, err = models.GetUserByUsername(Username)
		if err != nil {
			log.Printf("loginPostHandler: %s\n", err.Error())
			http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
			return
		}
	}
	if user == nil {
		http.Error(w, "Invalid username or email", http.StatusConflict)
		return
	}
	if err := CompareHashAndPassword(user.HashedPassword, Password); err != HasherErrorNone {
		http.Error(w, "Invalid password", http.StatusConflict)
		return
	}
	// Create a new session and set the cookie
	err2 := CreateSessionAndSetCookie("", w, user)
	if err2 != nil {
		http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
		return
	}
}
