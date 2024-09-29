package structs

import "time"

// /// for http.HandleFunc("/signup", SignupHandler)
type UserRquest struct {
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Username    string    `json:"username"`
	Password    string    `json:"password"`
	Email       string    `json:"email"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Image       []byte    `json:"image"`
	Bio         string    `json:"bio"`
	Nickname    string    `json:"nickname"`
}

// // used for http.HandleFunc("/post/addComment", AddCommentHandler)
// // http.HandleFunc("/post/createPost", CreatePostHandler)
type PostRequest struct {
	Title       string `json:"title"`
	GroupID     int    `json:"group_id"` /// since there is more than one group with teh exat nam eor title , we need to return the groupId from teh frount
	ParentID    int    `json:"parent_id"`
	Description string `json:"description"`
	Image       []byte `json:"image"`
	Privacy     string `json:"privacy"`
	Recipient   []int  `json:"recipient"` /// wil return array of the user names
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
	Options     []string  `json:"options"`
	EventDate   time.Time `json:"event_date"`
}

type GroupInviteRequest struct {
	GroupID int `json:"group_id"`
	UserID  int `json:"user_id"`
}
type EventResponseRequest struct {
	EventID  int `json:"event_id"`
	OptionID int `json:"option_id"`
}

type MessageRequest struct {
	Sender    string `json:"sender"`
	Recipient string `json:"recipient"`
	Message   string `json:"message"`
	Image     []byte `json:"image"`
}

type GroupMessageRequest struct {
	Sender  string `json:"sender"`
	GroupID int    `json:"group_id"`
	Message string `json:"message"`
	Image   []byte `json:"image"`
}
