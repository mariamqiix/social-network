package db

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    "path/filepath"

    "github.com/golang-migrate/migrate/v4"
    _ "github.com/golang-migrate/migrate/v4/database/sqlite3"
    _ "github.com/golang-migrate/migrate/v4/source/file"
    _ "github.com/mattn/go-sqlite3"
)

// DB holds the database connection
var Database *sql.DB

func Init() {
    // Define the database file and URL
    dbFile := "social_network.db"
    dbURL := "sqlite3://" + dbFile

    // Define the path to the migrations
    migrationsPath, err := filepath.Abs("backend/pkg/db/migrations")
    if err != nil {
        log.Fatalf("Failed to get absolute path for migrations: %v", err)
    }
    migrationsPath = "file://" + migrationsPath

    // Check if the database file exists
    if _, err := os.Stat(dbFile); os.IsNotExist(err) {
        // Database file does not exist, create it by applying migrations
        fmt.Println("Database does not exist. Applying migrations...")

        // Create a new migration instance
        m, err := migrate.New(migrationsPath, dbURL)
        if err != nil {
            log.Fatalf("Failed to create migration instance: %v", err)
        }

        // Apply migrations
        if err := m.Up(); err != nil && err != migrate.ErrNoChange {
            log.Fatalf("Failed to apply migrations: %v", err)
        } else {
            fmt.Println("Migrations applied successfully.")
        }
    } else {
        // Database file exists
        fmt.Println("Database already exists. No need to apply migrations.")
    }

    // Open the database connection
    Database, err = sql.Open("sqlite3", dbFile)
    if err != nil {
        log.Fatalf("Error opening database: %v", err)
    }

    // Check if the database connection is working
    if err := Database.Ping(); err != nil {
        log.Fatalf("Error connecting to database: %v", err)
    }

    fmt.Println("Database connection established.")
}