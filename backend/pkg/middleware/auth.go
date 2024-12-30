package middleware

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend/pkg/models"
	"backend/pkg/structs"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	fmt.Print("hello")
	if sessionUser != nil {
		writeToJson(sessionUser, w)
		return
	}
	if r.ContentLength > 1024*1024*7 {
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
	// if "123456789" != Password {
	// 	http.Error(w, "Invalid password", http.StatusConflict)
	// 	return
	// }
	// Create a new session and set the cookie
	err2 := CreateSessionAndSetCookie("", w, user)
	if err2 != nil {
		http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
		return
	}
	writeToJson(user, w)
}



func SignupHandler(w http.ResponseWriter, r *http.Request) {
	limiterUsername := "[GUESTS]"
	if !UserLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	var userRequest *structs.UserRquest
	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	hashedPassword, erro := GetHash(userRequest.Password)
	if erro != HasherErrorNone {
		fmt.Println(erro)
		errorServer(w, http.StatusInternalServerError)
		return
	}

	dob, err := time.Parse("2006-01-02", userRequest.DateOfBirth)
	if err != nil {
		fmt.Println(err)
		errorServer(w, http.StatusInternalServerError)
		return
	}
	imageID := 1
	if userRequest.Image != nil {
		imageBytes, err := base64.StdEncoding.DecodeString(*userRequest.Image)
		if err != nil {
			fmt.Println("Error decoding base64 image:", err)
			errorServer(w, http.StatusBadRequest)
			return
		}
		isImage, _ := IsDataImage(imageBytes)
		if isImage {
			imageID, err = models.UploadImage(imageBytes)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
				return
			}
		}
	}

	user := structs.User{
		Username:       userRequest.Username,
		UserType:       "member",
		ProfileType:    userRequest.ProfileType,
		Email:          userRequest.Email,
		HashedPassword: hashedPassword,
		FirstName:      userRequest.FirstName,
		LastName:       userRequest.LastName,
		DateOfBirth:    dob,
		ImageID:        &imageID,
		Bio:            &userRequest.Bio,
		Nickname:       &userRequest.Nickname,
	}

	err = models.CreateUser(user)
	if err != nil {
		fmt.Println(err)
		if err.Error() == "UNIQUE constraint failed: User.email" {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, "User already exists")
		} else {
			errorServer(w, http.StatusInternalServerError)
		}
		return
	}
	user2 , _ := models.GetUserByEmail(user.Email)
	err2 := CreateSessionAndSetCookie("", w, user2)
	if err2 != nil {
		http.Error(w, "something went wrong, please try again later", http.StatusInternalServerError)
		return
	}
	writeToJson(user, w)
}


func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}
	sessionToken := cookie.Value

	TokenInfo, err1 := models.GetSession(sessionToken)
	if err1 != nil {
		http.Error(w, "Something went wrong, contact server administrator", http.StatusInternalServerError)
		return
	} else if TokenInfo == nil {
		http.Error(w, "Something went wrong, user not logged in", http.StatusInternalServerError)
		return
	}
	err2 := models.DeleteUserSession(TokenInfo.ID)
	if err2 != nil {
		http.Error(w, "Something went wrong, contact server administrator", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:    "session",
		Expires: time.Unix(0, 0),
	})
}
