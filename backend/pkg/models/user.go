package models

import (
	"backend/pkg/structs"
	"fmt"
	"strconv"
)

func CreateUser(u structs.User) error {
	// Create a new record in the User table
	columns := []string{"username", "user_type", "email", "hashed_password", "first_name", "last_name", "profile_type", "date_of_birth", "profile_type", "image_id"}
	values := []interface{}{u.Username, u.UserType, u.Email, u.HashedPassword, u.FirstName, u.LastName, u.ProfileType, u.DateOfBirth, u.ProfileType, "-1"}
	return Create("User", columns, values)
}

func GetUserByUsername(username string) (*structs.User, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"*"}, []string{"username"}, []interface{}{username})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Check if a result is found
	if !rows.Next() {
		return nil, nil // No user found, return nil without error
	}

	// Create a User struct to hold the scanned data
	var user structs.User
	// Scan the row into the User struct fields
	err = rows.Scan(
		&user.ID,
		&user.Username,
		&user.UserType,
		&user.Email,
		&user.HashedPassword,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.ImageID,
		&user.Bio,
		&user.ProfileType,
		&user.Nickname,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning row: %v", err)
	}
	// Return the user struct if everything was successful
	return &user, nil
}

func GetUserByEmail(username string) (*structs.User, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"*"}, []string{"email"}, []interface{}{username})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Check if a result is found
	if !rows.Next() {
		return nil, nil // No user found, return nil without error
	}

	// Create a User struct to hold the scanned data
	var user structs.User
	// Scan the row into the User struct fields
	err = rows.Scan(
		&user.ID,
		&user.Username,
		&user.UserType,
		&user.Email,
		&user.HashedPassword,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.ImageID,
		&user.Bio,
		&user.ProfileType,
		&user.Nickname,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning row: %v", err)
	}
	// Return the user struct if everything was successful
	return &user, nil
}
func GetUserByID(id int) (*structs.User, error) {
	// Execute a read query to fetch the user by ID
	rows, err := Read("User", []string{"*"}, []string{"id"}, []interface{}{id})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Check if a result is found
	if !rows.Next() {
		return nil, nil // No user found, return nil without error
	}

	// Create a User struct to hold the scanned data
	var user structs.User
	// Scan the row into the User struct fields
	err = rows.Scan(
		&user.ID,
		&user.Username,
		&user.UserType,
		&user.Email,
		&user.HashedPassword,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.ImageID,
		&user.Bio,
		&user.ProfileType,
		&user.Nickname,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning row: %v", err)
	}
	// Return the user struct if everything was successful
	return &user, nil
}

func GetAllUsers() ([]structs.User, error) {
	// Execute a read query to fetch all users
	rows, err := Read("User", []string{"id", "username"}, []string{}, []interface{}{})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Create a slice to hold the users
	var users []structs.User
	// Iterate over the rows
	for rows.Next() {
		// Create a User struct to hold the scanned data
		var user structs.User
		// Scan the row into the User struct fields
		err = rows.Scan(
			&user.ID,
			&user.Username,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		// Append the user struct to the slice
		users = append(users, user)
	}
	// Return the slice of users if everything was successful
	return users, nil
}

func UpdateUser(u structs.User) error {
	// Create slices for the columns to update and their corresponding values
	var updateColumns []string
	var updateValues []interface{}

	// Iterate over the map to populate the slices
	updates := map[string]interface{}{
		"username":        u.Username,
		"email":           u.Email,
		"user_type":       u.UserType,
		"hashed_password": u.HashedPassword,
		"first_name":      u.FirstName,
		"last_name":       u.LastName,
		"date_of_birth":   u.DateOfBirth,
		"image_id":        u.ImageID,
		"bio":             u.Bio,
		"profile_type":    u.ProfileType,
		"nickname":        u.Nickname,
	}

	for col, val := range updates {
		// Skip columns with nil values to avoid SQL errors
		if val != nil {
			updateColumns = append(updateColumns, col)
			updateValues = append(updateValues, val)
		}
	}

	// Execute an update query to update the user
	return Update("User", updateColumns, updateValues, []string{"id"}, []interface{}{u.ID})
}

func CreateUserSession(s structs.Session) error {
	// Create a new record in the Session table
	columns := []string{"token", "user_id"}
	values := []interface{}{s.Token, s.UserID}
	return Create("UserSession", columns, values)
}

func DeleteUserSession(userId int) error {
	// Execute a delete query to delete the session
	return Delete("UserSession", []string{"id"}, []interface{}{userId})
}

func GetPassword(colomn, username string) (string, error) {
	// Execute a read query to fetch the password hash by username
	rows, err := Read("User", []string{"hashed_password"}, []string{colomn}, []interface{}{username})
	if err != nil {
		return "", fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return "", fmt.Errorf("no password hash found")
	}
	var passwordHash string
	err = rows.Scan(&passwordHash)
	if err != nil {
		return "", fmt.Errorf("error scanning row: %v", err)
	}
	return passwordHash, nil
}

func GetPasswordByUserID(id int) (string, error) {
	return GetPassword("id", strconv.Itoa(id))
}

func GetPasswordByUseename(username string) (string, error) {
	return GetPassword("username", username)
}

func GetPasswordByEmail(email string) (string, error) {
	return GetPassword("email", email)
}

func GetSession(token string) (*structs.Session, error) {
	// Execute a read query to fetch the session by token
	rows, err := Read("UserSession", []string{"*"}, []string{"token"}, []interface{}{token})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Check if a result is found
	if !rows.Next() {
		return nil, nil // No session found, return nil without error
	}

	// Create a Session struct to hold the scanned data
	var session structs.Session
	// Scan the row into the Session struct fields
	err = rows.Scan(
		&session.ID,
		&session.Token,
		&session.UserID,
		&session.CreationTime,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning row: %v", err)
	}
	// Return the session struct if everything was successful
	return &session, nil
}

func CreateFollower(f structs.Follower) error {
	// Create a new record in the Follower table
	columns := []string{"following_id", "follower_id"}
	values := []interface{}{f.FollowingID, f.FollowerID}
	return Create("Follower", columns, values)
}

func DeleteFollower(f structs.Follower) error {
	// Execute a delete query to delete the follower
	return Delete("Follower", []string{"following_id", "follower_id"}, []interface{}{f.FollowingID, f.FollowerID})
}

func GetFollowers(userID int) ([]structs.Follower, error) {
	return GetFollows(userID, "following_id")
}

func GetFollowings(userID int) ([]structs.Follower, error) {
	return GetFollows(userID, "follower_id")
}

func GetFollows(userID int, followType string) ([]structs.Follower, error) {
	// Execute a read query to fetch the followers for the given user ID
	rows, err := Read("Follower", []string{"*"}, []string{followType}, []interface{}{userID})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Create a slice to hold the followers
	var followers []structs.Follower

	// Iterate over the rows
	for rows.Next() {
		// Create a Follower struct to hold the scanned data
		var follower structs.Follower
		// Scan the row into the Follower struct fields
		err := rows.Scan(
			&follower.ID,
			&follower.FollowingID,
			&follower.FollowerID,
			&follower.Status,
			&follower.Time,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		// Append the follower struct to the slice
		followers = append(followers, follower)
	}

	// Check if any error occurred during row iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	// Return the slice of followers if everything was successful
	return followers, nil
}

func GetUserEmailByUsername(username string) (string, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"email"}, []string{"username"}, []interface{}{username})
	if err != nil {
		return "", fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return "", fmt.Errorf("no user found")
	}
	var email string
	err = rows.Scan(&email)
	if err != nil {
		return "", fmt.Errorf("error scanning row: %v", err)
	}
	return email, nil
}
func GetUserEmailByID(id int) (string, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"email"}, []string{"id"}, []interface{}{id})
	if err != nil {
		return "", fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return "", fmt.Errorf("no user found")
	}
	var email string
	err = rows.Scan(&email)
	if err != nil {
		return "", fmt.Errorf("error scanning row: %v", err)
	}
	return email, nil
}

func GetUsernameByUserId(userId int) (string, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"username"}, []string{"id"}, []interface{}{userId})
	if err != nil {
		return "", fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return "", fmt.Errorf("no user found")
	}
	var username string
	err = rows.Scan(&username)
	if err != nil {
		return "", fmt.Errorf("error scanning row: %v", err)
	}
	return username, nil
}

func GetUsernameByEmail(email string) (string, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"username"}, []string{"email"}, []interface{}{email})
	if err != nil {
		return "", fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return "", fmt.Errorf("no user found")
	}
	var username string
	err = rows.Scan(&username)
	if err != nil {
		return "", fmt.Errorf("error scanning row: %v", err)
	}
	return username, nil
}

func CheckUsernameExists(username string) (bool, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"username"}, []string{"username"}, []interface{}{username})
	if err != nil {
		return false, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return false, nil
	}
	return true, nil
}

func CheckEmailExists(email string) (bool, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"email"}, []string{"email"}, []interface{}{email})
	if err != nil {
		return false, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return false, nil
	}
	return true, nil
}

func GetUserIdByUsername(username string) (int, error) {
	// Execute a read query to fetch the user by username
	rows, err := Read("User", []string{"id"}, []string{"username"}, []interface{}{username})
	if err != nil {
		return 0, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return 0, fmt.Errorf("no user found")
	}
	var id int
	err = rows.Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("error scanning row: %v", err)
	}
	return id, nil
}
