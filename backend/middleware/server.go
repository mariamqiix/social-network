package middleware

import (
	"fmt"
	"net/http"
)

func GoLive(){

	http.HandleFunc("/homePage",HomePageHandler)

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}


func HomePageHandler(w http.ResponseWriter, r *http.Request) {}