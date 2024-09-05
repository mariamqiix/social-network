package structs

import "time"

type User struct {
	ID             int       // Primary key
	Username       string    // Unique username (VARCHAR(10))
	UserType       string    // Required user type (VARCHAR(10))
	HashedPassword string    // Hashed password (CHAR(60))
	FirstName      string    // First name (VARCHAR(16))
	LastName       string    // Last name (VARCHAR(16))
	DateOfBirth    time.Time // Date of birth (DATE)
	ImageID        *int      // Foreign key to Image table, nullable
	Bio            *string   // Bio (TEXT), nullable
	ProfileType    string    // Profile type (VARCHAR(20)), defaults to 'public'
	Nickname       *string   // Nickname (VARCHAR(16)), nullable
}

type Follower struct {
	ID          int       // Primary key
	FollowingID int       // Foreign key to User table (User that is being followed)
	FollowerID  int       // Foreign key to User table (User who is following)
	Status      *string   // Status (VARCHAR(50)), nullable
	Time        time.Time // Timestamp, defaults to CURRENT_TIMESTAMP
}

type Session struct {
	ID           int       // Primary key
	Token        string    // Session token (VARCHAR(64))
	UserID       int       // Foreign key to User table
	CreationTime time.Time // Timestamp, defaults to CURRENT_TIMESTAMP
}

// Post represents a record in the Post table.
type Post struct {
    ID           int
    UserID       int
    GroupID      int
    ParentID     int
    Content      string
    ImageID      int
    Privacy      string
    CreationDate time.Time
}

// Recipient represents a record in the Recipient table.
type Recipient struct {
    ID          int
    PostID      int
    RecipientID int
}

// Reaction represents a record in the Reaction table.
type Reaction struct {
    ID           int
    UserID       int
    PostID   int
    ReactionType string
    CreationDate time.Time
}