package middleware

import "backend/pkg/structs"

type homeView struct {
	Posts []structs.PostResponse
	User  *structs.UserResponse // nil if not logged in
}

type PostPageView struct {
	User     *structs.UserResponse // nil if not logged in
	Posts    structs.PostResponse
	Comments []structs.PostResponse
}

type GroupsHomePageView struct {
	User   *structs.UserResponse // nil if not logged in
	Posts  []structs.PostResponse
	Groups []structs.GroupResponse
}

type GroupPageView struct {
	User    *structs.UserResponse // nil if not logged in
	Posts   []structs.PostResponse
	Group   structs.GroupResponse
	Members []structs.BasicUserResponse
}

type ChatPageView struct {
	User     *structs.UserResponse // nil if not logged in
	Messages []structs.ChatResponse
}

type ProfilePageView struct {
	User          *structs.UserResponse // nil if not logged in
	ProfileUser   *structs.UserResponse
	Posts         []structs.PostResponse
	Following     []structs.BasicUserResponse
	Followers     []structs.BasicUserResponse
	LikedPosts    []structs.PostResponse
	DislikedPosts []structs.PostResponse
}
