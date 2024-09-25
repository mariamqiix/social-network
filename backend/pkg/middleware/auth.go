package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"log"
	"net/http"
)

func LoginPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.ContentLength > 1024 {
		http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
		return
	}
	var user *structs.User
	var err error
	Username := r.FormValue("username")
	Password := r.FormValue("password")
	// check if the email is valid and exists
	if IsValidEmail(Username) {
		exist, err := models.CheckExistance("User", []string{"email"}, []interface{}{Username})
		if err != nil {
			log.Printf("loginPostHandler: %s\n", err.Error())
			http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
			return
		} else if !exist {
			http.Error(w, "Invalid username or email or password", http.StatusConflict)
			return
		}
		user, err = models.GetUserByEmail(Username)
		if err != nil {
			http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
			return
		}
	} else {
		user, err = models.GetUserByUsername(Username)
		if err != nil {
			log.Printf("loginPostHandler: %s\n", err.Error())
			http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
			return
		}
	}
	if user == nil {
		http.Error(w, "Invalid username or email", http.StatusConflict)
		return
	}
	if err := CompareHashAndPassword(user.HashedPassword, Password); err != HasherErrorNone {
		http.Error(w, "Invalid password", http.StatusConflict)
		return
	}
	// Create a new session and set the cookie
	err2 := CreateSessionAndSetCookie("", w, user)
	if err2 != nil {
		http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
		return
	}
}


