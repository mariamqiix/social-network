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

type GroupsPageView struct {
	User   *structs.UserResponse // nil if not logged in
	Posts  []structs.PostResponse
	Groups []structs.GroupResponse
}

type GroupPageView struct {
	User  *structs.UserResponse // nil if not logged in
	Posts []structs.PostResponse
	Group structs.GroupResponse
}
