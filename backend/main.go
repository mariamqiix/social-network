package main

import (
	"backend/pkg/db"
	"backend/pkg/middleware"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db.Init() // Ensure this is called to initialize the database connection
	middleware.GoLive()
}
