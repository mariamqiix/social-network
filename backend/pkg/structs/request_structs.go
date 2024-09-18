package structs

import "time"

type UserRquest struct {
	Username    string    `json:"username"`
	Password    string    `json:"password"`
	Nickname    string    `json:"nickname"`
	Email       string    `json:"email"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Bio         string    `json:"bio"`
	Image       []byte    `json:"image"`
}

type PostRequest struct {
	Title       string   `json:"title"`
	GroupID     int      `json:"group_id"` /// since there is more than one group with teh exat nam eor title , we need to return the groupId from teh frount
	Description string   `json:"description"`
	Image       []byte   `json:"image"`
	Privacy     string   `json:"privacy"`
	Recipient   []string `json:"recipient"` /// wil return array of the user names
}

type CreateGroupRequest struct {
	Creator     string `json:"creator"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Image       []byte `json:"image"`
}

type EventRequest struct {
	Creator     string    `json:"creator"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	EventDate   time.Time `json:"event_date"`
}

type EventResponeRequesr struct {
	EventID  int    `json:"event_id"`
	Username string `json:"username"`
	Response string `json:"response"`
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
