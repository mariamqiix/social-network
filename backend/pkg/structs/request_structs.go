package structs

import "time"

// /// for http.HandleFunc("/signup", SignupHandler)
type UserRquest struct {
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	Username    string  `json:"username"`
	Password    string  `json:"password"`
	Email       string  `json:"email"`
	DateOfBirth string  `json:"date_of_birth"`
	Image       *string `json:"image"`
	Bio         string  `json:"bio"`
	Nickname    string  `json:"nickname"`
	ProfileType string  `json:"type"`
}

// // used for http.HandleFunc("/post/addComment", AddCommentHandler)
// // http.HandleFunc("/post/createPost", CreatePostHandler)
type PostRequest struct {
	Description string  `json:"description"`
	Image       *string `json:"image"`
	Privacy     string  `json:"privacy"`
	Recipient   []int   `json:"recipient"` /// wil return array of the user ids
}

// // used for http.HandleFunc("/post/addComment", AddCommentHandler)
// // http.HandleFunc("/post/createPost", CreatePostHandler)
type GroupPostRequest struct {
	GroupID     int     `json:"group_id"` /// since there is more than one group with teh exat nam eor title , we need to return the groupId from teh frount
	Description string  `json:"description"`
	Image       *string `json:"image"`
}

type CommentGroupRequest struct {
	GroupID     int    `json:"group_id"` /// since there is more than one group with teh exat nam eor title , we need to return the groupId from teh frount
	ParentID    int    `json:"parent_id"`
	Description string `json:"description"`
}

type CommentRequest struct {
	ParentID    int     `json:"parent_id"`
	Description string  `json:"description"`
	Image       *string `json:"image"`
}

type CreateGroupRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Image       []byte `json:"image"`
}

type EventRequest struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	GroupID     int       `json:"group_id"`
	Options     []Option  `json:"options"`
	Time        time.Time `json:"time"`
}

type Option struct {
	Option   string `json:"option"`
	IconName string `json:"icon_name"`
}
type GroupInviteRequest struct {
	GroupID int `json:"group_id"`
	UserID  int `json:"user_id"`
}

type GroupInviteRequestResponse struct {
	GroupID int `json:"group_id"`
	UserID  int `json:"user_id"`
}

type EventResponseRequest struct {
	EventID  int `json:"event_id"`
	OptionID int `json:"option_id"`
}

type ReactoinRequest struct {
	PostID   int    `json:"post_id"`
	Reaction string `json:"reaction"`
}

type GroupInviteResponse struct {
	GroupID  int    `json:"group_id"`
	Response string `json:"response"`
}

type GroupRequestResponse struct {
	GroupID  int    `json:"group_id"`
	UserID   int    `json:"user_id"`
	Response string `json:"response"`
}

type UserInfoRequest struct {
	UserID   int    `json:"user_id"`
	Response string `json:"response"`
}

type UserChangeRequest struct {
	UserID  int    `json:"user_id"`
	Privacy string `json:"privacy"`
}

type MessageRequest struct {
	Type           string  `json:"type"`
	SenderUsername string  `json:"sender_username"`
	ReceiverId     string  `json:"receiver_id"`
	GroupID        int     `json:"group_id"`
	Message        string  `json:"message"`
	Image          *string `json:"image"`
}
