package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"log"
	"net/http"
	"strconv"
)

func PostPageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	postID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing post id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	post, err := models.GetPostByID(postID)
	if err != nil {
		log.Printf("error getting post: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	comments, err := models.GetPostComments(postID)
	if err != nil {
		log.Printf("error getting comments: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	User := ReturnUserResponse(sessionUser)
	view := PostPageView{
		User:     User,
		Posts:    mapPosts(sessionUser, []structs.Post{*post})[0],
		Comments: mapPosts(sessionUser, comments),
	}

	writeToJson(view, w)
}
