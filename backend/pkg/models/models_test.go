package models

import (
	"backend/pkg/db"
	"backend/pkg/structs"
	"testing"
	"time"
)

// MockRows is a struct to simulate database rows for testing purposes
type MockRows struct{}

func (mr *MockRows) Next() bool                     { return false }
func (mr *MockRows) Scan(dest ...interface{}) error { return nil }
func (mr *MockRows) Close() error                   { return nil }
func (mr *MockRows) Err() error                     { return nil }

func TestConnectDB(t *testing.T) {
	// Attempt to connect to the database
	err := db.ConnectDB()

	// Ensure the connection does not return an error
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}
}

func TestCreateUser(t *testing.T) {
	// Define a mock user to create
	mockUser := structs.User{
		Username:       "testuser",
		UserType:       "regular",
		HashedPassword: "hashedpassword",
		FirstName:      "Test",
		LastName:       "User",
		DateOfBirth:    time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
		ProfileType:    "public",
		ImageID:        nil,
	}

	// Call the CreateUser function
	err := CreateUser(mockUser)
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}
}

func TestGetUserByUsername(t *testing.T) {
	// Define a username to query
	username := "testuser"

	// Call the GetUserByUsername function
	user, err := GetUserByUsername(username)
	if err != nil {
		t.Fatalf("Failed to get user by username: %v", err)
	}

	if user == nil {
		t.Fatalf("No user found with username: %s", username)
	}

	// Validate the returned user data
	if user.Username != username {
		t.Errorf("Expected username %s, but got %s", username, user.Username)
	}
}

func TestGetUserByID(t *testing.T) {
	// Define a user ID to query (replace with a valid ID)
	userID := 1

	// Call the GetUserByID function
	user, err := GetUserByID(userID)
	if err != nil {
		t.Fatalf("Failed to get user by ID: %v", err)
	}

	if user == nil {
		t.Fatalf("No user found with ID: %d", userID)
	}

	// Validate the returned user data
	if user.ID != userID {
		t.Errorf("Expected user ID %d, but got %d", userID, user.ID)
	}
}

func TestGetAllUsers(t *testing.T) {
	// Call the GetAllUsers function
	users, err := GetAllUsers()
	if err != nil {
		t.Fatalf("Failed to get all users: %v", err)
	}

	if len(users) == 0 {
		t.Fatalf("Expected at least one user, but got none")
	}

	// Optionally, validate data for the first user
	firstUser := users[0]
	if firstUser.Username == "" {
		t.Errorf("Expected username to be populated, but got an empty string")
	}
}

func TestUpdateUser(t *testing.T) {
	// Fetch a user to update (assuming ID 1 exists)
	user, err := GetUserByID(1)
	if err != nil {
		t.Fatalf("Failed to get user: %v", err)
	}

	// Modify some user attributes
	user.FirstName = "UpdatedName"

	// Call the UpdateUser function
	err = UpdateUser(*user)
	if err != nil {
		t.Fatalf("Failed to update user: %v", err)
	}

	// Fetch the user again to validate the update
	updatedUser, err := GetUserByID(1)
	if err != nil {
		t.Fatalf("Failed to get updated user: %v", err)
	}

	if updatedUser.FirstName != "UpdatedName" {
		t.Errorf("Expected first name to be UpdatedName, but got %s", updatedUser.FirstName)
	}
}

func TestCreateUserSession(t *testing.T) {
	// Define a mock session to create
	mockSession := structs.Session{
		Token:  "testtoken",
		UserID: 1, // Replace with a valid user ID
	}

	// Call the CreateUserSession function
	err := CreateUserSession(mockSession)
	if err != nil {
		t.Fatalf("Failed to create user session: %v", err)
	}
}

func TestDeleteUserSession(t *testing.T) {
	// Define a mock user ID to delete the session for
	userID := "1" // Replace with a valid user ID

	// Call the DeleteUserSession function
	err := DeleteUserSession(userID)
	if err != nil {
		t.Fatalf("Failed to delete user session: %v", err)
	}
}
func TestGetPasswordByUsername(t *testing.T) {
	// Define a mock username to query
	username := "testuser"

	// Call the GetPasswordByUsername function
	passwordHash, err := GetPasswordByUseename(username)
	if err != nil {
		t.Fatalf("Failed to get password by username: %v", err)
	}

	if passwordHash == "" {
		t.Fatalf("Expected password hash to be populated, but got empty")
	}
}

func TestCreateFollower(t *testing.T) {
	// Define a mock follower to create
	mockFollower := structs.Follower{
		FollowingID: 1,
		FollowerID:  2,
	}

	// Call the CreateFollower function
	err := CreateFollower(mockFollower)
	if err != nil {
		t.Fatalf("Failed to create follower: %v", err)
	}
}

func TestDeleteFollower(t *testing.T) {
	// Define a mock follower to delete
	mockFollower := structs.Follower{
		FollowingID: 1,
		FollowerID:  2,
	}

	// Call the DeleteFollower function
	err := DeleteFollower(mockFollower)
	if err != nil {
		t.Fatalf("Failed to delete follower: %v", err)
	}
}

func TestCreateUserPost(t *testing.T) {
	userId := 1
	post := structs.Post{
		UserID:  &userId,
		Content: "This is a test post",
		ImageID: -1,
		Privacy: "public",
	}

	err := CreateUserPost(post)
	if err != nil {
		t.Errorf("CreateUserPost failed: %v", err)
	}
}

func TestCreateGroupPost(t *testing.T) {
	groupId := 1
	post := structs.Post{
		GroupID: &groupId,
		Content: "This is a test group post",
		ImageID: -1,
	}

	err := CreateGroupPost(post)
	if err != nil {
		t.Errorf("CreateGroupPost failed: %v", err)
	}
}

func TestCreateComment(t *testing.T) {
	UserID := 1
	ParentID := 1

	post := structs.Post{
		UserID:   &UserID,
		ParentID: &ParentID,
		Content:  "This is a test comment",
		ImageID:  -1,
	}

	err := CreateComment(post)
	if err != nil {
		t.Errorf("CreateComment failed: %v", err)
	}
}

func TestDeletePost(t *testing.T) {
	postID := 1
	err := DeletePost(postID)
	if err != nil {
		t.Errorf("DeletePost failed: %v", err)
	}
}

func TestGetPostByID(t *testing.T) {
	postID := 3
	post, err := GetPostByID(postID)
	if err != nil {
		t.Errorf("GetPostByID failed: %v", err)
	}
	if post == nil {
		t.Errorf("Expected a post, got nil")
	}
}

func TestGetGroupPosts(t *testing.T) {
	groupID := 1
	posts, err := GetGroupPosts(groupID)
	if err != nil {
		t.Errorf("GetGroupPosts failed: %v", err)
	}
	if len(posts) == 0 {
		t.Errorf("Expected posts, got none")
	}
}

func TestUpdatePostPrivacy(t *testing.T) {
	postID := 1
	newPrivacy := "private"
	err := UpdatePostPrivacy(postID, newPrivacy)
	if err != nil {
		t.Errorf("UpdatePostPrivacy failed: %v", err)
	}
}

func TestConnectDB2(t *testing.T) {
	// Attempt to connect to the database
	err := db.ConnectDB()

	// Ensure the connection does not return an error
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}
}

func TestGetUserPosts(t *testing.T) {
	userID := 1

	// Setup: Insert a post for the user
	post := structs.Post{
		UserID:   &userID,
		Content:  "This is a test post",
		Privacy:  "public",
		ParentID: nil, // Top-level post
	}
	err := CreateUserPost(post)
	if err != nil {
		t.Fatalf("Setup failed: %v", err)
	}

	// Test: Retrieve posts for the user
	posts, err := GetUserPosts(userID)
	if err != nil {
		t.Errorf("GetUserPosts failed: %v", err)
	}
	if len(posts) == 0 {
		t.Errorf("Expected posts, got none")
	}
}

func TestAddReaction(t *testing.T) {
	reaction := structs.Reaction{
		UserID:       1,
		PostID:       1,
		ReactionType: "like",
	}

	err := AddReaction(reaction)
	if err != nil {
		t.Errorf("AddReaction failed: %v", err)
	}
}

func TestGetPostReactions(t *testing.T) {
	postID := 1
	reactions, err := GetPostReactions(postID)
	if err != nil {
		t.Errorf("GetPostReactions failed: %v", err)
	}
	if len(reactions) == 0 {
		t.Errorf("Expected reactions, got none")
	}
}
