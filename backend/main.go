package main

import (
    "backend/pkg/db"

    _ "github.com/mattn/go-sqlite3"
)

func main() {
    db.Init() // Ensure this is called to initialize the database connection 
}