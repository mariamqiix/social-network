package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"fmt"
	"net/http"
)

var userLimiter *UserRateLimiter

func GoLive() {

	http.HandleFunc("/homePage", HomePageHandler)
	http.HandleFunc("/postPage/{id}", PostPageHandler)

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	view := homeView{
		Posts: nil,
		User:  nil,
	}

	if sessionUser != nil {
		view.User = &structs.UserResponse{
			Id:          sessionUser.ID,
			Username:    sessionUser.Username,
			Nickname:    *sessionUser.Nickname,
			Email:       sessionUser.Email,
			FirstName:   sessionUser.FirstName,
			LastName:    sessionUser.LastName,
			DateOfBirth: sessionUser.DateOfBirth,
			Bio:         *sessionUser.Bio,
			Image:       GetImageData(*sessionUser.ImageID), // will use it as url(data:image/jpeg;base64,base64string)
		}
	}
	var posts []structs.Post
	var err error
	if sessionUser != nil {
		posts, err = models.GetPostsForUser(sessionUser.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
	} else {
		posts, err = models.GetPostsForGuest()
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
	}
	view.Posts = mapPosts(sessionUser, posts)
	writeToJson(view, w)
}
