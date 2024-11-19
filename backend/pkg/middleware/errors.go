package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend/pkg/structs"
)

type ErrorResponse struct {
	Message string                `json:"message"`
	User    *structs.UserResponse `json:"user,omitempty"`
}

func errorServer(w http.ResponseWriter, code int) {
	w.WriteHeader(code)
	w.Header().Set("Content-Type", "application/json")
	view := ErrorResponse{}
	switch code {
	case http.StatusNotFound:
		view.Message = "Resource Not Found"
	case http.StatusInternalServerError:
		view.Message = "Internal Server Error"
	default:
		// as a fallback get a default text for the status code
		fmt.Printf("errorServer: %d is not implemented\n", code)
		view.Message = http.StatusText(code)
	}

	err := json.NewEncoder(w).Encode(view)
	if err != nil {
		fmt.Printf("errorServer: %s\n", err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
