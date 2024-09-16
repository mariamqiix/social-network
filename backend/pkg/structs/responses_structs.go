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

type PostResponse struct {
	Id           int              `json:"id"`
	Content      string           `json:"content"`
	Author       UserResponse     `json:"author"`
	Group        GroupResponse    `json:"group"`
	CreationDate time.Time        `json:"created_at"`
	Privacy      string           `json:"privacy"`
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
	Id           int           `json:"id"`
	Group        GroupResponse `json:"group"`
	Creator      UserResponse  `json:"creator"`
	Title        string        `json:"title"`
	Description  string        `json:"description"`
	EventTime    time.Time     `json:"event_time"`
	CreationDate time.Time     `json:"created_at"`
}
