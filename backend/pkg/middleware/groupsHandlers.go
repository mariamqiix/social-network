package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"log"
	"net/http"
	"strconv"
)

func GroupPageHandlerl(w http.ResponseWriter, r *http.Request) {
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
	group, err := models.GetGroupByID(groupID)
	if err != nil {
		log.Printf("error getting group: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	posts, err := models.GetGroupPosts(groupID)
	if err != nil {
		log.Printf("error getting group posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	GroupResponse := mapGroups(*sessionUser, []structs.Group{*group})[0]
	User := ReturnUserResponse(sessionUser)
	view := GroupPageView{
		User:  User,
		Posts: mapPosts(sessionUser, posts),
		Group: GroupResponse,
	}

	writeToJson(view, w)
}
