package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"log"
	"net/http"
	"strconv"
)

func PostPageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	postID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing post id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	post, err := models.GetPostByID(postID)
	if err != nil {
		log.Printf("error getting post: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	comments, err := models.GetPostComments(postID)
	if err != nil {
		log.Printf("error getting comments: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	User := ReturnUserResponse(sessionUser)
	view := PostPageView{
		User:     User,
		Posts:    mapPosts(sessionUser, []structs.Post{*post})[0],
		Comments: mapPosts(sessionUser, comments),
	}

	writeToJson(view, w)
}

func GroupPostsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	groupID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing group id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	posts, err := models.GetGroupPosts(groupID)
	if err != nil {
		log.Printf("error getting posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	User := ReturnUserResponse(sessionUser)
	view := homeView{
		User:  User,
		Posts: mapPosts(sessionUser, posts),
	}

	writeToJson(view, w)
}

func GroupsPage(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	groups, err := models.GetAllGroups()
	if err != nil {
		log.Printf("error getting user groups: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if !userLimiter.Allow(limiterUsername) {
		view := GroupsPageView{
			User:   nil,
			Groups: mapGroups(*sessionUser, groups),
		}
		writeToJson(view, w)
		return
	}
	posts, err := models.GetGroupPostsForUser(sessionUser.ID)
	if err != nil {
		log.Printf("error getting user group posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	User := ReturnUserResponse(sessionUser)
	view := GroupsPageView{
		User:   User,
		Posts:  mapPosts(sessionUser, posts),
		Groups: mapGroups(*sessionUser, groups),
	}

	writeToJson(view, w)
}
