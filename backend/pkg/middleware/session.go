package middleware

import (
	"errors"
	"net/http"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
	"backend/pkg/structs"
)

func CreateSessionAndSetCookie(token string, w http.ResponseWriter, user *structs.User) error {
	sID := ""
	if token != "" {
		sID = token
	} else {
		sID = GenerateSession()

	}
	if sID == "" {
		return errors.New("error generating session id")
	}

	newSession := &structs.Session{
		Token:        sID,
		UserID:       &user.ID,
		CreationTime: time.Now(),
	}
	// Add the session to the database
	err := models.CreateUserSession(*newSession)
	if err != nil {
		return errors.New("error adding session")
	}

	cookie := SessionToCookie(newSession)
	if cookie == nil {
		return errors.New("error creating cookie")
	}
	http.SetCookie(w, cookie)

	return nil
}

const SESSION_EXPIRY = 30 * 24 * 60 * 60

// converts a session struct to a http.Cookie
func SessionToCookie(session *structs.Session) *http.Cookie {
	return &http.Cookie{
		Name:     "session",
		Value:    session.Token,
		Expires:  time.Unix(session.CreationTime.Unix()+SESSION_EXPIRY, 0),
		HttpOnly: true, // to prevent XSS
		Path:     "/",
	}
}

// generates a new session token based on a UUIDv7, returns "" if an error occurs
func GenerateSession() string {
	uuid, err := uuid.NewV7()
	if err != nil {
		return ""
	}
	buff, err := uuid.MarshalText()
	if err != nil {
		return ""
	}
	return string(buff)
}
