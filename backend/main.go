package main

import (
	_ "github.com/mattn/go-sqlite3"

	"backend/pkg/db"
	"backend/pkg/middleware"
)

func main() {

	db.Init() // Ensure this is called to initialize the database connection
	middleware.GoLive()

}
