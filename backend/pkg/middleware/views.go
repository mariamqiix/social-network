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
