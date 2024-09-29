package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func GroupsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	splitPath := strings.Split(r.URL.Path, "/")
	AllGroups, err := models.GetAllGroups()
	if err != nil {
		log.Printf("error getting groups: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if sessionUser == nil {
		view := GroupsHomePageView{
			User:   nil,
			Groups: mapGroups(sessionUser, AllGroups),
		}
		writeToJson(view, w)
		return
	}
	if len(splitPath) == 3 {
		Posts, err := models.GetGroupPostsForUser(sessionUser.ID)
		if err != nil {
			log.Printf("error getting posts: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		var groups []structs.Group
		switch splitPath[2] {
		case "joind":
			groups, err = models.GetUserGroups(sessionUser.ID)
			if err != nil {
				log.Printf("error getting groups: %s\n", err.Error())
				errorServer(w, http.StatusInternalServerError)
				return
			}
		case "created":
			groups, err = models.GetGroupsCreatedByTheUser(sessionUser.ID)
			if err != nil {
				log.Printf("error getting groups: %s\n", err.Error())
				errorServer(w, http.StatusInternalServerError)
				return
			}
		case "requested":
			groups, err = models.GetGroupByRequest("Request", sessionUser.ID)
			if err != nil {
				log.Printf("error getting groups: %s\n", err.Error())
			}
		case "invited":
			groups, err = models.GetGroupByRequest("Invite", sessionUser.ID)
			if err != nil {
				log.Printf("error getting groups: %s\n", err.Error())
			}
		default:
			groups = AllGroups
		}
		view := GroupsHomePageView{
			User:   ReturnUserResponse(sessionUser),
			Groups: mapGroups(sessionUser, groups),
			Posts:  mapPosts(sessionUser, Posts),
		}
		writeToJson(view, w)
	}

}

////

// / create a group
func CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if r.ContentLength > 1024 {
		http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
		return
	}
	var createGroupRequest structs.CreateGroupRequest
	err := json.NewDecoder(r.Body).Decode(createGroupRequest)
	if err != nil {
		log.Printf("Error unmarshalling data: %s\n", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	imageID := 0
	if createGroupRequest.Image != nil {
		isImage, _ := IsDataImage(createGroupRequest.Image)
		if isImage {
			imageID, err = models.UploadImage(createGroupRequest.Image)
			if err != nil {
				log.Printf("SignupHandler: %s\n", err.Error())
			}
		}
	}
	group := structs.Group{
		Title:       createGroupRequest.Title,
		Description: createGroupRequest.Description,
		CreatorID:   sessionUser.ID,
		ImageID:     &imageID,
	}
	err = models.CreateGroup(group)
	if err != nil {
		log.Printf("error creating group: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

//// end function

// // join group functoin
func JoinGroupHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	groupId := r.URL.Query().Get("id")
	groupID, err := strconv.Atoi(groupId)
	if err != nil {
		log.Printf("error parsing group id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	isExist, err := models.CheckExistance("GroupTable", []string{"id"}, []interface{}{groupID})
	if err != nil {
		log.Printf("error checking group existence: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if !isExist {
		errorServer(w, http.StatusNotFound)
		return
	}
	err = models.AddUserRequestJoinGroup(sessionUser.ID, groupID)
	if err != nil {
		log.Printf("error adding user to group: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

///// end function

// // leave group function
func LeaveGroupHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	groupId := r.URL.Query().Get("id")
	groupID, err := strconv.Atoi(groupId)
	if err != nil {
		log.Printf("error parsing group id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	isExist, err := models.CheckExistance("GroupTable", []string{"id"}, []interface{}{groupID})
	if err != nil {
		log.Printf("error checking group existence: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if !isExist {
		errorServer(w, http.StatusNotFound)
		return
	}
	err = models.RemoveMember(sessionUser.ID, groupID)
	if err != nil {
		log.Printf("error removing user from group: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusCreated)
}

//// end function

// // group page handler
func GroupPageHandler(w http.ResponseWriter, r *http.Request) {
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
	group, err := models.GetGroupByID(groupId)
	if err != nil {
		log.Printf("error getting group: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if sessionUser == nil {
		view := GroupPageView{
			User:  nil,
			Group: mapGroups(sessionUser, []structs.Group{*group})[0],
		}
		writeToJson(view, w)
		return
	}

	posts, err := models.GetGroupPosts(groupId)
	if err != nil {
		log.Printf("error getting group posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	groupMembers, err := models.GetGroupMembers(groupId)
	if err != nil {
		log.Printf("error getting group members: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	view := GroupPageView{
		User:    ReturnUserResponse(sessionUser),
		Group:   mapGroups(sessionUser, []structs.Group{*group})[0],
		Posts:   mapPosts(sessionUser, posts),
		Members: MapMembers(groupMembers),
	}
	writeToJson(view, w)

}

//// end function

// //invite user function
func InviteUserHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	var Invite structs.GroupInviteRequest
	err := json.NewDecoder(r.Body).Decode(Invite)
	if err != nil {
		log.Printf("error unmarshalling data: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	err = models.AddInviteToGroup(Invite.GroupID, Invite.UserID)
	if err != nil {
		log.Printf("error adding invite: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

/// end function

func ListEventHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if sessionUser == nil {
		return
	}
	path := strings.Split(r.URL.Path, "/")
	switch path[2] {
	case "group":
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
		return
	case "user":
		events, err := models.GetUserEvents(sessionUser.ID)
		if err != nil {
			log.Printf("error getting events: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		Events := mapEvents(*sessionUser, events)
		writeToJson(Events, w)
	}

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

// // create event handler
func CreateEventHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	var eventRequest structs.EventRequest
	err := json.NewDecoder(r.Body).Decode(eventRequest)
	if err != nil {
		log.Printf("error unmarshalling data: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	Event := structs.Event{
		CreatorID:   sessionUser.ID,
		GroupID:     eventRequest.GroupID,
		Title:       eventRequest.Title,
		Description: eventRequest.Description,
		EventTime:   eventRequest.EventDate,
	}
	err = models.CreateEvent(Event)
	for _, option := range eventRequest.Options {
		err := models.AddEventOption(Event.ID, option)
		if err != nil {
			log.Printf("error adding event option: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
	}
	if err != nil {
		log.Printf("error creating event: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// end function
