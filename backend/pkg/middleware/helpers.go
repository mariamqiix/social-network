package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"regexp"
	"strings"
	"time"
)

var emailRegex = regexp.MustCompile(`^[\w]+@[\w]+\.[a-zA-Z]{2,}$`)

func IsValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

func GetUser(r *http.Request) *structs.User {
	sessionCookie, err := r.Cookie("session")
	if err == http.ErrNoCookie {
		return nil
	}

	sessionExists, _ := models.CheckExistance("UserSession", []string{"token"}, []interface{}{sessionCookie.Value})
	if !sessionExists {
		return nil
	}

	session, err := models.GetSession(sessionCookie.Value)
	if err != nil {
		log.Printf("error getting session: %s\n", err.Error())
		return nil
	}
	// a nill foreign key means the user is a guest
	if session.UserID == nil {
		return &structs.User{
			UserType: "Guest",
		}
	}
	user, err := models.GetUserByID(*session.UserID)
	if err != nil {
		log.Printf("error getting user by user id: %s\n", err.Error())
		return nil
	}
	return user
}

func writeToJson(v any, w http.ResponseWriter) error {
	buff, err := json.Marshal(v)
	if err != nil {
		return err
	}
	w.Header().Add("Content-Type", "application/json")
	_, err = w.Write(buff)
	return err
}

func GetImageData(imageID *int) string {
	if imageID == nil {
		return ""
	}
	// Retrieve the image data from the database
	imageData, err := models.GetImageByID(*imageID)
	if err != nil {
		return ""
	}

	if imageData == nil {
		return ""
	}

	// Encode the image data to base64
	base64Image := base64.StdEncoding.EncodeToString(imageData.Data)
	return base64Image
}
func mapPosts(sessionUser *structs.User, posts []structs.Post) []structs.PostResponse {
	var postResponses []structs.PostResponse
	for _, post := range posts {
		user, err := models.GetUserByID(*post.UserID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}

		var Group structs.GroupResponse
		if post.GroupID != nil {
			group, err := models.GetGroupByID(*post.GroupID)
			if err != nil {
				log.Printf("error getting group by group id: %s\n", err.Error())
				continue
			}
			user, err = models.GetUserByID(group.CreatorID)
			if err != nil {
				log.Printf("error getting user by user id: %s\n", err.Error())
				continue
			}
			var IsUserMember bool
			if sessionUser != nil {
				IsUserMember, err = models.CheckExistance("GroupMember", []string{"group_id", "user_id"}, []interface{}{group.ID, sessionUser.ID})
				if err != nil {
					log.Printf("error sea: %s\n", err.Error())
					continue
				}
			} else {
				IsUserMember = false
			}
			members, err := models.GetGroupMembers(group.ID)
			if err != nil {
				log.Printf("error getting group members by group id: %s\n", err.Error())
				continue
			}
			GroupCreator := ReturnUserResponse(user)
			Group = structs.GroupResponse{
				Id:           group.ID,
				Creator:      *GroupCreator,
				Title:        group.Title,
				Description:  group.Description,
				IsUserMember: IsUserMember,
				Image:        GetImageData(group.ImageID),
				CreationDate: group.CreationDate,
				GroupMember:  len(members),
			}
		}
		auther := ReturnUserResponse(user)
		postResponses = append(postResponses, structs.PostResponse{
			Id:           post.ID,
			Author:       *auther,
			Group:        Group,
			Content:      post.Content,
			Image:        GetImageData(post.ImageID),
			CreationDate: post.CreationDate,
			Likes:        *MapReaction(sessionUser, &post, "Like"),
			Dislikes:     *MapReaction(sessionUser, &post, "Dislike"),
		})
	}
	return postResponses
}
func ReturnUserResponse(user *structs.User) *structs.UserResponse {
	if user == nil {
		return nil
	}
	userResponse := structs.UserResponse{
		Id:          user.ID,
		Username:    user.Username,
		Nickname:    *user.Nickname,
		Email:       user.Email,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		DateOfBirth: user.DateOfBirth,
		Bio:         *user.Bio,
		Image:       GetImageData(user.ImageID), // will use it as url(data:image/jpeg;base64,base64string)
	}
	return &userResponse
}

func MapReaction(User *structs.User, post *structs.Post, reactionType string) *structs.ReactionResponse {
	didUserReact := false
	if User != nil {
		didUserReact, _ = models.DidUserReact(post.ID, User.ID, reactionType)

	}

	count, err := models.GetPostReactions(post.ID)
	if err != nil {
		log.Printf("error counting reactions by post id: %s\n", err.Error())
		return nil
	}
	return &structs.ReactionResponse{
		DidUserReact: didUserReact,
		Count:        len(count),
	}

}

func mapGroups(sessionUser *structs.User, groups []structs.Group) []structs.GroupResponse {
	var groupResponses []structs.GroupResponse
	for _, group := range groups {
		user, err := models.GetUserByID(group.CreatorID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		var IsUserMember bool
		if sessionUser != nil {
			IsUserMember, err = models.CheckExistance("GroupMember", []string{"group_id", "user_id"}, []interface{}{group.ID, sessionUser.ID})
			if err != nil {
				log.Printf("error checking if user is member of group: %s\n", err.Error())
				continue
			}
		} else {
			IsUserMember = false
		}
		members, err := models.GetGroupMembers(group.ID)
		if err != nil {
			log.Printf("error getting group members by group id: %s\n", err.Error())
			continue
		}

		GroupCreator := ReturnUserResponse(user)
		groupResponses = append(groupResponses, structs.GroupResponse{
			Id:           group.ID,
			Creator:      *GroupCreator,
			Title:        group.Title,
			Description:  group.Description,
			IsUserMember: IsUserMember,
			Image:        GetImageData(group.ImageID),
			CreationDate: group.CreationDate,
			GroupMember:  len(members),
		})
	}
	return groupResponses
}

func MapMembers(members []structs.GroupMember) []structs.BasicUserResponse {
	var memberResponses []structs.BasicUserResponse
	for _, User := range members {
		member := ReturnBasicUser(User.UserID)
		memberResponses = append(memberResponses, *member)
	}
	return memberResponses
}

func mapEvents(sessionUser structs.User, events []structs.Event) []structs.GroupEventResponse {
	var eventResponses []structs.GroupEventResponse
	for _, event := range events {
		user, err := models.GetUserByID(event.CreatorID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		Group, err := models.GetGroupByID(event.GroupID)
		if err != nil {
			log.Printf("error getting group by group id: %s\n", err.Error())
			continue
		}
		GroupResponse := mapGroups(&sessionUser, []structs.Group{*Group})[0]
		EventCreator := ReturnUserResponse(user)
		eventResponses = append(eventResponses, structs.GroupEventResponse{
			Id:           event.ID,
			Creator:      *EventCreator,
			Group:        GroupResponse,
			Title:        event.Title,
			Description:  event.Description,
			Options:      MapOptions(event.ID, &sessionUser),
			EventTime:    event.EventTime,
			CreationDate: event.CreationDate,
		})
	}
	return eventResponses
}

func MapOptions(groupId int, sessionUser *structs.User) []structs.EventOptionsResponse {
	var optionResponses []structs.EventOptionsResponse
	options, err := models.GetEventOptions(groupId)
	if err != nil {
		log.Printf("error getting event options by group id: %s\n", err.Error())
		return nil
	}
	for _, option := range options {
		responses, err := models.GetEventResponsesByEventIdAndEventOptionId(option.EventID, option.ID)
		if err != nil {
			log.Printf("error getting event responses by event id and event option id: %s\n", err.Error())
			continue
		}
		var users []structs.BasicUserResponse
		for _, response := range responses {
			users = append(users, *ReturnBasicUser(response.UserID))
		}
		var didRespone bool
		if sessionUser == nil {
			didRespone = false
		} else {
			didRespone, err = models.CheckExistance("EventResponse", []string{"event_id", "user_id", "response_id"}, []interface{}{option.EventID, sessionUser.ID, option.ID})
			if err != nil {
				log.Printf("error checking if user is member of group: %s\n", err.Error())
				continue
			}
		}
		optionResponses = append(optionResponses, structs.EventOptionsResponse{
			Id:             option.ID,
			Option:         option.OptionName,
			IconNAme:       option.IconName,
			Count:          len(responses),
			UserResponde:   users,
			DidUserRespone: didRespone,
		})

	}
	return optionResponses
}

func ReturnBasicUser(userId int) *structs.BasicUserResponse {
	user, err := models.GetUserByID(userId)
	if err != nil {
		log.Printf("error getting user by user id: %s\n", err.Error())
		return nil
	}
	nickname := user.FirstName + " " + user.LastName
	if user.Nickname != nil {
		nickname = *user.Nickname
	}
	return &structs.BasicUserResponse{
		Id:       user.ID,
		Username: user.Username,
		Nickname: nickname,
		Image:    GetImageData(user.ImageID),
	}
}

func mapChats(sessionuser structs.User, chats []structs.GroupChat) []structs.GroupChatResponse {
	var chatResponses []structs.GroupChatResponse
	for _, chat := range chats {
		user, err := models.GetUserByID(chat.SenderID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		IsItTheUserMessage := chat.SenderID == sessionuser.ID
		chatResponses = append(chatResponses, structs.GroupChatResponse{
			Id:           chat.ID,
			Sender:       *ReturnBasicUser(user.ID),
			Content:      chat.Message,
			CreationDate: chat.CreationDate,
			Sended:       IsItTheUserMessage, /// if the user is the one who sent the message or not
			Image:        GetImageData(user.ImageID),
			Color:        randomLightColor(),
		})
	}
	return chatResponses
}

// randomLightColor generates a random light color in hexadecimal format.
func randomLightColor() string {
	rand.Seed(time.Now().UnixNano())
	r := 128 + rand.Intn(128) // Range: 128-255
	g := 128 + rand.Intn(128) // Range: 128-255
	b := 128 + rand.Intn(128) // Range: 128-255
	return fmt.Sprintf("#%02X%02X%02X", r, g, b)
}

func mapMessages(Messages []structs.UserChat) []structs.ChatResponse {
	var chatResponses []structs.ChatResponse
	for _, chat := range Messages {
		Sender, err := models.GetUserByID(chat.SenderID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		Receiver, err := models.GetUserByID(chat.ReceiverID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		chatResponses = append(chatResponses, structs.ChatResponse{
			Id:           chat.ID,
			Sender:       *ReturnBasicUser(Sender.ID),
			Receiver:     *ReturnBasicUser(Receiver.ID),
			Content:      chat.Message,
			CreationDate: chat.CreationDate,
			Image:        GetImageData(&chat.ImageID),
		})
	}
	return chatResponses
}

func MapUsers(followers []structs.Follower) []structs.UserResponse {
	var NewFollowers []structs.UserResponse
	for _, follower := range followers {
		user, err := models.GetUserByID(follower.FollowerID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		UserResponse := ReturnUserResponse(user)
		NewFollowers = append(NewFollowers, *UserResponse)
	}
	return NewFollowers
}

// TODO: Implement mapNotifications, which should return a slice of structs.NotificatoinResponse.
// use case statment for teh Type , we should determine the type of the notification and map it to the correct struct
// example : if the type is "FriendRequest" we should map it to have Sender Struct , if the type Is "GroupInvitation" we should map it to have Group Struct
func MapNotifications(sessionUser structs.User, notifications []structs.Notification) ([]structs.NotificatoinResponse, error) {
	var notificationRespose []structs.NotificatoinResponse
	for _, notification := range notifications {
		var notificate *structs.NotificatoinResponse
		var err error
		switch notification.NotificationType {
		case "GroupInviteReject":
			notificate, err = createGroupNotificationResponse(notification, "rejected")
			if err != nil {
				return nil, err
			}

		case "GroupInviteAccept":
			notificate, err = createGroupNotificationResponse(notification, "accepted")
			if err != nil {
				return nil, err
			}

		case "GroupRequestReject":
			notificate, err = createGroupNotificationRequestResponse(notification, "rejected")
			if err != nil {
				return nil, err
			}

		case "GroupRequestAccept":
			notificate, err = createGroupNotificationRequestResponse(notification, "accepted")
			if err != nil {
				return nil, err
			}

		case "followRequestReject":
			notificate, err = createFollowNotificationResponse(notification, 1)
			if err != nil {
				return nil, err
			}

		case "followRequestAccept":
			notificate, err = createFollowNotificationResponse(notification, 2)
			if err != nil {
				return nil, err
			}

		case "startFollow":
			notificate, err = createFollowNotificationResponse(notification, 3)
			if err != nil {
				return nil, err
			}

		case "followRequest":
			notificate, err = createFollowNotificationResponse(notification, 4)
			if err != nil {
				return nil, err
			}

		case "GroupNewEvent": 
			group, err := models.GetGroupByID(*notification.GroupID)
			if err != nil {
				return nil, err
			}

			event, err := models.GetEventByID(*notification.EventID)
			if err != nil {
				return nil, err
			}

			notificate = &structs.NotificatoinResponse{
				Id:           notification.ID,
				Type:         notification.NotificationType,
				GroupID:      *notification.GroupID,
				EventID:      *notification.EventID,
				IsRead:       notification.IsRead,
				CreationDate: notification.CreationDate,
				Message:      event.Title + " event has been created in " + group.Title,
			}

		case "GroupInvite":
			group, err := models.GetGroupByID(*notification.GroupID)
			if err != nil {
				return nil, err
			}

			notificate = &structs.NotificatoinResponse{
				Id:           notification.ID,
				Type:         notification.NotificationType,
				GroupID:      *notification.GroupID,
				IsRead:       notification.IsRead,
				CreationDate: notification.CreationDate,
				Message:      "You've been invited to join " + group.Title + " group.",
			}

		case "GroupRequestToJoin":
			group, err := models.GetGroupByID(*notification.GroupID)
			if err != nil {
				return nil, err
			}

			userRequeted, err := models.GetUserByID(notificate.SenderID)
			if err != nil {
				return nil, err
			}

			notificate = &structs.NotificatoinResponse{
				Id:           notification.ID,
				Type:         notification.NotificationType,
				GroupID:      *notification.GroupID,
				IsRead:       notification.IsRead,
				CreationDate: notification.CreationDate,
				Message:      userRequeted.Username + " has has rquested to join your " + group.Title + " group.",
			}
		}

		if notificate != nil {
			notificationRespose = append(notificationRespose, *notificate)
		}

	}

	return notificationRespose, nil
}

func IsDataImage(buff []byte) (bool, string) {
	// the function that actually does the trick
	t := http.DetectContentType(buff)
	return strings.HasPrefix(t, "image"), t
}

func createGroupNotificationRequestResponse(notification structs.Notification, msg string) (*structs.NotificatoinResponse, error) {
	group, err := models.GetGroupByID(*notification.GroupID)
	if err != nil {
		return nil, err
	}

	return &structs.NotificatoinResponse{
		Id:           notification.ID,
		Type:         notification.NotificationType,
		SenderID:     *notification.SenderID,
		GroupID:      group.ID,
		IsRead:       notification.IsRead,
		CreationDate: notification.CreationDate,
		Message:      "Your request to join " + strings.Title(group.Title) + " group has been " + msg + ".",
	}, nil
}

func createGroupNotificationResponse(notification structs.Notification, msg string) (*structs.NotificatoinResponse, error) {
	group, err := models.GetGroupByID(*notification.GroupID)
	if err != nil {
		return nil, err
	}

	user, err := models.GetUserByID(*notification.SenderID)
	if err != nil {
		return nil, err
	}

	return &structs.NotificatoinResponse{
		Id:           notification.ID,
		Type:         notification.NotificationType,
		SenderID:     *notification.SenderID,
		GroupID:      group.ID,
		IsRead:       notification.IsRead,
		CreationDate: notification.CreationDate,
		Message:      user.Username+ " has "+msg+" your invitation to join " + strings.Title(group.Title) + ".",
	}, nil
}

func createFollowNotificationResponse(notification structs.Notification, code int) (*structs.NotificatoinResponse, error) {
	user, err := models.GetUserByID(*notification.SenderID)
	if err != nil {
		return nil, err
	}

	mssage := ""

	if code == 1 {
		mssage = user.Username + " has reject your follow request."
	} else if code == 2 {
		mssage = user.Username + " has accept your follow request."
	} else if code == 3 {
		mssage = user.Username + " started follow you."
	} else if code == 4 {
		mssage = user.Username + " wants to follow you."

	}

	return &structs.NotificatoinResponse{
		Id:           notification.ID,
		Type:         notification.NotificationType,
		SenderID:     *notification.SenderID,
		IsRead:       notification.IsRead,
		CreationDate: notification.CreationDate,
		Message:      mssage,
	}, nil
}
