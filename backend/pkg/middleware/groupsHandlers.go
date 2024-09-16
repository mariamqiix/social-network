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

func GroupPageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
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
	User := ReturnUserResponse(sessionUser)
	Members, err := models.GetGroupMembers(groupID)
	if err != nil {
		log.Printf("error getting group members: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	view := GroupPageView{
		User:    User,
		Posts:   mapPosts(sessionUser, posts),
		Group:   mapGroups(*sessionUser, []structs.Group{*group})[0],
		Members: MapMembers(Members),
	}
	writeToJson(view, w)
}

func EventsPageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	groupId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing group id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	events, err := models.GetGroupEvents(groupId)
	if err != nil {
		log.Printf("error getting events: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	Events := mapEvents(*sessionUser, events)
	writeToJson(Events, w)
}

func GroupChatsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	groupId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing group id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	chats, err := models.GetGroupMessages(groupId)
	if err != nil {
		log.Printf("error getting chats: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	Chats := mapChats(*sessionUser, chats)
	writeToJson(Chats, w)
}

func UserEventsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		return
	}
	events, err := models.GetUserEvents(sessionUser.ID)
	if err != nil {
		log.Printf("error getting events: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	Events := mapEvents(*sessionUser, events)
	writeToJson(Events, w)
}
