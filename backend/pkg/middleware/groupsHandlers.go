package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func GroupHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the endpoint from the request path
	path := strings.TrimPrefix(r.URL.Path, "/group/")

	if strings.Contains(path, "event/list") {
		ListEventHandler(w, r)
		return
	} else if strings.Contains(path, "list/") {
		GroupsHandler(w, r)
		return
	}
	switch path {
	case "messages":
		GroupChatsHandler(w, r)
		return

	case "createGroup":
		CreateGroupHandler(w, r)
		return

	case "requestToJoin":
		JoinGroupHandler(w, r)
		return

	case "leaveGroup":
		LeaveGroupHandler(w, r)
		return

	case "page":
		GroupPageHandler(w, r)
		return

	case "inviteUser":
		InviteUserHandler(w, r)
		return

	case "event/create":
		CreateEventHandler(w, r)
		return

	case "event/userResponse":
		CreateEventResponseHandler(w, r)
		return
	case "UsersToInvite":
		UsersToInviteHandler(w, r)
		return
	default:
		http.Error(w, "Invalid endpoint", http.StatusNotFound)
	}
}

func UsersToInviteHandler(w http.ResponseWriter, r *http.Request) {
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
	groupId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	users, err := models.GetUsersToInvite(sessionUser.ID, groupId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
	var view []structs.UserResponse
	for _, user := range users {
		view = append(view, *ReturnUserResponse(&user))
	}

	writeToJson(view, w)
}

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
	splitPath := strings.TrimPrefix(r.URL.Path, "/group/list/")
	AllGroups, err := models.GetAllGroups()
	if err != nil {
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
	if splitPath != "" {

		Posts, err := models.GetGroupPostsForUser(sessionUser.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
		var groups []structs.Group
		switch splitPath {
		case "joind":
			groups, err = models.GetUserGroups(sessionUser.ID)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
				return
			}
		case "created":
			groups, err = models.GetGroupsCreatedByTheUser(sessionUser.ID)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
				return
			}
		case "requested":
			groups, err = models.GetGroupByRequest("Request", sessionUser.ID)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
			}
		case "invited":
			groups, err = models.GetGroupByRequest("Invite", sessionUser.ID)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
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
	var createGroupRequest structs.CreateGroupRequest
	err := json.NewDecoder(r.Body).Decode(&createGroupRequest)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	imageID := 0
	if createGroupRequest.Image != nil {

		isImage, _ := IsDataImage(createGroupRequest.Image)
		if isImage {
			imageID, err = models.UploadImage(createGroupRequest.Image)
			if err != nil {
				fmt.Print(err)
				errorServer(w, http.StatusInternalServerError)
			}
		}
	}
	group := structs.Group{
		Title:       createGroupRequest.Title,
		Description: createGroupRequest.Description,
		CreatorID:   sessionUser.ID,
		ImageID:     &imageID,
	}
	id, err := models.CreateGroup(group)
	if err != nil {
		fmt.Print(err)
		errorServer(w, http.StatusInternalServerError)
		return
	}

	err = models.AddMember(id, sessionUser.ID)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

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
		errorServer(w, http.StatusBadRequest)
		return
	}
	isExist, err := models.CheckExistance("GroupTable", []string{"id"}, []interface{}{groupID})
	if err != nil || !isExist {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	err = models.AddUserRequestJoinGroup(groupID, sessionUser.ID)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	group, err := models.GetGroupByID(groupID)

	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
	models.CreateGroupsNotification(structs.Notification{
		UserID:           group.CreatorID,
		NotificationType: "GroupRequestToJoin",
		SenderID:         &sessionUser.ID,
		GroupID:          &groupID,
		IsRead:           false,
	})

	w.WriteHeader(http.StatusCreated)
}

// // leave group function
func LeaveGroupHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	fmt.Print("hello")
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	groupId := r.URL.Query().Get("id")
	groupID, err := strconv.Atoi(groupId)
	if err != nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	isExist, err := models.CheckExistance("GroupTable", []string{"id"}, []interface{}{groupID})
	if err != nil || !isExist {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	err = models.RemoveMember(groupID, sessionUser.ID)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
	}
	fmt.Print(sessionUser.ID, groupID)
	w.WriteHeader(http.StatusCreated)
}

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
		errorServer(w, http.StatusBadRequest)
		return
	}

	group, err := models.GetGroupByID(groupId)
	if err != nil {
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

	IsMember, err := models.CheckExistance("GroupMember", []string{"group_id", "user_id"}, []interface{}{groupId, sessionUser.ID})
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	if !IsMember {
		view := GroupPageView{
			User:  ReturnUserResponse(sessionUser),
			Group: mapGroups(sessionUser, []structs.Group{*group})[0],
		}
		writeToJson(view, w)
		return
	}
	fmt.Print(groupId)
	posts, err := models.GetGroupPosts(groupId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
	fmt.Print((posts))

	groupMembers, err := models.GetGroupMembers(groupId)
	if err != nil {
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

// //invite user function
func InviteUserHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	if sessionUser == nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	var Invite structs.GroupInviteRequest
	err := json.NewDecoder(r.Body).Decode(&Invite)
	if err != nil {
		errorServer(w, http.StatusBadRequest)
		return
	}
	err = models.AddInviteToGroup(Invite.GroupID, Invite.UserID)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)

	models.CreateGroupsNotification(structs.Notification{
		UserID:           Invite.UserID,
		NotificationType: "GroupInvite",
		GroupID:          &Invite.GroupID,
		IsRead:           false,
	})
}

func ListEventHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}

	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
	}

	if sessionUser == nil {
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/group/event/list/")

	switch path {
	case "group":
		groupId, err := strconv.Atoi(r.URL.Query().Get("id"))
		if err != nil {
			errorServer(w, http.StatusBadRequest)
			return
		}

		events, err := models.GetGroupEvents(groupId)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		Events := mapEvents(*sessionUser, events)
		writeToJson(Events, w)
		return

	case "user":
		events, err := models.GetUserEvents(sessionUser.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}

		Events := mapEvents(*sessionUser, events)
		writeToJson(Events, w)
	}

}

func GroupChatsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	if sessionUser == nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	groupId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		errorServer(w, http.StatusBadRequest)
		return
	}

	chats, err := models.GetGroupMessages(groupId)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	if chats == nil {
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
	err := json.NewDecoder(r.Body).Decode(&eventRequest)
	if err != nil {
		fmt.Println(err)
		errorServer(w, http.StatusBadRequest)
		return
	}

	Event := structs.Event{
		CreatorID:   sessionUser.ID,
		GroupID:     eventRequest.GroupID,
		Title:       eventRequest.Title,
		Description: eventRequest.Description,
		EventTime:   eventRequest.Time,
	}

	eventID, err := models.CreateEvent(Event)
	for _, option := range eventRequest.Options {
		err := models.AddEventOption(eventID, option.Option, option.IconName)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
	}

	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	groupMembers, err := models.GetGroupMembers(eventRequest.GroupID)

	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}

	for _, member := range groupMembers {
		models.CreateEventsNotification(structs.Notification{
			UserID:           member.UserID,
			NotificationType: "GroupNewEvent",
			GroupID:          &eventRequest.GroupID,
			IsRead:           false,
		})
	}

	w.WriteHeader(http.StatusCreated)
}

func CreateEventResponseHandler(w http.ResponseWriter, r *http.Request) {
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

	var eventResponse structs.EventResponseRequest
	err := json.NewDecoder(r.Body).Decode(&eventResponse)
	if err != nil {
		errorServer(w, http.StatusBadRequest)
		return
	}

	respone := structs.EventResponse{
		UserID:   sessionUser.ID,
		EventID:  eventResponse.EventID,
		Response: eventResponse.OptionID,
	}

	err = models.CreateEventResponse(respone)
	if err != nil {
		errorServer(w, http.StatusInternalServerError)
		return
	}
}
