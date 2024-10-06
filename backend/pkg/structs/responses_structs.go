package structs

import (
	"time"
)

type UserResponse struct {
	Id          int       `json:"id"`
	Username    string    `json:"username"`
	Nickname    string    `json:"nickname"`
	Email       string    `json:"email"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"DateOfBirth"`
	Bio         string    `json:"bio"`
	Image       string    `json:"image_url"`
}

type BasicUserResponse struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Nickname string `json:"nickname"`
	Image    string `json:"image_url"`
}

type PostResponse struct {
	Id           int              `json:"id"`
	Content      string           `json:"content"`
	Author       UserResponse     `json:"author"`
	Group        GroupResponse    `json:"group"`
	CreationDate time.Time        `json:"created_at"`
	Image        string           `json:"image_url"`
	Likes        ReactionResponse `json:"likes"`
	Dislikes     ReactionResponse `json:"dislikes"`
}

type ReactionResponse struct {
	DidUserReact bool `json:"didReact"`
	Count        int  `json:"count"`
}

type GroupResponse struct {
	Id           int          `json:"id"`
	Creator      UserResponse `json:"creator"`
	Title        string       `json:"title"`
	Description  string       `json:"description"`
	Image        string       `json:"image_url"`
	IsUserMember bool         `json:"is_user_member"`
	CreationDate time.Time    `json:"created_at"`
}

type GroupMemberResponse struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Nickname string `json:"nickname"`
}

type GroupEventResponse struct {
	Id           int                    `json:"id"`
	Group        GroupResponse          `json:"group"`
	Creator      UserResponse           `json:"creator"`
	Title        string                 `json:"title"`
	Description  string                 `json:"description"`
	Options      []EventOptionsResponse `json:"options"`
	EventTime    time.Time              `json:"event_time"`
	CreationDate time.Time              `json:"created_at"`
}

type EventOptionsResponse struct {
	Option         string              `json:"option"`
	Count          int                 `json:"count"`
	UserResponde   []BasicUserResponse `json:"users_response"`
	DidUserRespone bool                `json:"did_user_respond"`
}

type GroupChatResponse struct {
	Id           int          `json:"id"`
	Sender       UserResponse `json:"Sender"`
	Sended       bool         `json:"sended"` /// if the user is the one who sent the message or not
	Content      string       `json:"content"`
	Image        string       `json:"image_url"`
	Color        string       `json:"color"`
	CreationDate time.Time    `json:"created_at"`
}

type NotificatoinResponse struct {
	Id           int       `json:"id"`
	Type         string    `json:"type"`
	SenderID     int       `json:"sender_id"`
	GroupID      int       `json:"group_id"`
	Event        int       `json:"event"`
	IsRead       bool      `json:"is_read"`
	Message      string    `json:"message"`
	CreationDate time.Time `json:"created_at"`
}

type ChatResponse struct {
	Id           int          `json:"id"`
	Sender       UserResponse `json:"Sender"`
	Receiver     UserResponse `json:"receiver"`
	Content      string       `json:"content"`
	Image        string       `json:"image_url"`
	Color        string       `json:"color"`
	CreationDate time.Time    `json:"created_at"`
}

type ProfileResponse struct {
	Id               int       `json:"id"`
	Username         string    `json:"username"`
	Nickname         string    `json:"nickname"`
	Email            string    `json:"email"`
	FirstName        string    `json:"first_name"`
	LastName         string    `json:"last_name"`
	DateOfBirth      time.Time `json:"DateOfBirth"`
	Bio              string    `json:"bio"`
	Image            string    `json:"image_url"`
	UserPosts        []Post    `json:"user_posts"`
	UserLikedPost    []Post    `json:"user_Liked_posts"`
	UserDislikedPost []Post    `json:"user_Disliked_posts"`
}
