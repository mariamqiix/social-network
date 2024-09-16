package middleware

import (
	"backend/pkg/models"
	"log"
	"net/http"
)

func UserChatHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	chatUser := r.URL.Query().Get("Username")
	ChatId, err := models.GetUserIdByUsername(chatUser)
	if err != nil {
		log.Printf("error parsing chat id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	Messages, err := models.GetUserMessages(
		sessionUser.ID,
		ChatId,
	)
	if err != nil {
		log.Printf("error getting chat: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	view := ChatPageView{
		User:     ReturnUserResponse(sessionUser),
		Messages: mapMessages(Messages),
	}

	writeToJson(view, w)
}

