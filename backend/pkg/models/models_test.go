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
		Email:          "testuser@example.com",
		HashedPassword: "hashedpassword",
		FirstName:      "Test",
		LastName:       "User",
		DateOfBirth:    time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
		ProfileType:    "Public",
		ImageID:        nil,
	}

	// Call the CreateUser function
	err := CreateUser(mockUser)
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}
}

func TestGetUserEmailByUsername(t *testing.T) {
	username := "testuser"

	// Assuming the user exists
	email, err := GetUserEmailByUsername(username)
	if err != nil {
		t.Fatalf("GetUserEmailByUsername() error = %v", err)
	}
	if email == "" {
		t.Fatalf("GetUserEmailByUsername() returned empty email, expected a valid email")
	}

	// Assuming the user does not exist
	username = "nonexistentuser"
	email, err = GetUserEmailByUsername(username)
	if err == nil {
		t.Fatalf("GetUserEmailByUsername() expected error, got nil")
	}
	if email != "" {
		t.Fatalf("GetUserEmailByUsername() returned email, expected empty string")
	}
}

func TestGetUserEmailByID(t *testing.T) {
	id := 1

	// Assuming the user exists
	email, err := GetUserEmailByID(id)
	if err != nil {
		t.Fatalf("GetUserEmailByID() error = %v", err)
	}
	if email == "" {
		t.Fatalf("GetUserEmailByID() returned empty email, expected a valid email")
	}

	// Assuming the user does not exist
	id = 999
	email, err = GetUserEmailByID(id)
	if err == nil {
		t.Fatalf("GetUserEmailByID() expected error, got nil")
	}
	if email != "" {
		t.Fatalf("GetUserEmailByID() returned email, expected empty string")
	}
}

func TestGetUsernameByUserId(t *testing.T) {
	userId := 1

	// Assuming the user exists
	username, err := GetUsernameByUserId(userId)
	if err != nil {
		t.Fatalf("GetUsernameByUserId() error = %v", err)
	}
	if username == "" {
		t.Fatalf("GetUsernameByUserId() returned empty username, expected a valid username")
	}

	// Assuming the user does not exist
	userId = 999
	username, err = GetUsernameByUserId(userId)
	if err == nil {
		t.Fatalf("GetUsernameByUserId() expected error, got nil")
	}
	if username != "" {
		t.Fatalf("GetUsernameByUserId() returned username, expected empty string")
	}
}

func TestGetUsernameByEmail(t *testing.T) {
	email := "testuser@example.com"

	// Assuming the user exists
	username, err := GetUsernameByEmail(email)
	if err != nil {
		t.Fatalf("GetUsernameByEmail() error = %v", err)
	}
	if username == "" {
		t.Fatalf("GetUsernameByEmail() returned empty username, expected a valid username")
	}

	// Assuming the user does not exist
	email = "nonexistent@example.com"
	username, err = GetUsernameByEmail(email)
	if err == nil {
		t.Fatalf("GetUsernameByEmail() expected error, got nil")
	}
	if username != "" {
		t.Fatalf("GetUsernameByEmail() returned username, expected empty string")
	}
}

func TestCheckUsernameExists(t *testing.T) {
	username := "testuser"

	// Assuming the username exists
	exists, err := CheckUsernameExists(username)
	if err != nil {
		t.Fatalf("CheckUsernameExists() error = %v", err)
	}
	if !exists {
		t.Fatalf("CheckUsernameExists() returned false, expected true")
	}

	// Assuming the username does not exist
	username = "nonexistentuser"
	exists, err = CheckUsernameExists(username)
	if err != nil {
		t.Fatalf("CheckUsernameExists() error = %v", err)
	}
	if exists {
		t.Fatalf("CheckUsernameExists() returned true, expected false")
	}
}

func TestCheckEmailExists(t *testing.T) {
	email := "testuser@example.com"

	// Assuming the email exists
	exists, err := CheckEmailExists(email)
	if err != nil {
		t.Fatalf("CheckEmailExists() error = %v", err)
	}
	if !exists {
		t.Fatalf("CheckEmailExists() returned false, expected true")
	}

	// Assuming the email does not exist
	email = "nonexistent@example.com"
	exists, err = CheckEmailExists(email)
	if err != nil {
		t.Fatalf("CheckEmailExists() error = %v", err)
	}
	if exists {
		t.Fatalf("CheckEmailExists() returned true, expected false")
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
	UserId := 1
	mockSession := structs.Session{
		Token:  "testtoken",
		UserID: &UserId, // Replace with a valid user ID
	}

	// Call the CreateUserSession function
	err := CreateUserSession(mockSession)
	if err != nil {
		t.Fatalf("Failed to create user session: %v", err)
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

func TestCreateUserPost(t *testing.T) {
	userId := 1
	ImageId := -1

	post := structs.Post{
		UserID:  &userId,
		Content: "This is a test post",
		ImageID: &ImageId,
		Privacy: "Public",
	}

	_, err := CreateUserPost(post)
	if err != nil {
		t.Errorf("CreateUserPost failed: %v", err)
	}
}

func TestCreateGroupPost(t *testing.T) {
	groupId := 1
	ImageId := -1

	post := structs.Post{
		GroupID: &groupId,
		Content: "This is a test group post",
		ImageID: &ImageId,
		Privacy: "Public",
	}

	err := CreateGroupPost(post)
	if err != nil {
		t.Errorf("CreateGroupPost failed: %v", err)
	}
}

func TestCreateComment(t *testing.T) {
	UserID := 1
	ParentID := 1
	ImageId := -1

	post := structs.Post{
		UserID:   &UserID,
		ParentID: &ParentID,
		Content:  "This is a test comment",
		ImageID:  &ImageId,
		Privacy:  "Public",
	}

	err := CreateNormalComment(post)
	if err != nil {
		t.Errorf("CreateComment failed: %v", err)
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
	newPrivacy := "Private"
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
		Privacy:  "Public",
		ParentID: nil, // Top-level post
	}
	_, err := CreateUserPost(post)
	if err != nil {
		t.Fatalf("Setup failed: %v", err)
	}

	// Test: Retrieve posts for the user
	posts, err := GetUserPosts("Public", userID)
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
		ReactionType: "Like",
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

func TestCreateGroup(t *testing.T) {
	group := structs.Group{
		CreatorID:    1,
		Title:        "Test Group",
		Description:  "Test Description",
		CreationDate: time.Now(),
	}
	err := CreateGroup(group)
	if err != nil {
		t.Fatalf("CreateGroup() error = %v", err)
	}
}

func TestCheckGroupCreator(t *testing.T) {
	groupID := 1
	userID := 1

	// Assuming the user is the creator of the group
	exists, err := CheckGroupCreator(groupID, userID)
	if err != nil {
		t.Fatalf("1CheckGroupCreator() error = %v", err)
	}
	if !exists {
		t.Fatalf("1CheckGroupCreator() returned false, expected true")
	}

	// Assuming the user is not the creator of the group
	groupID = 999
	exists, err = CheckGroupCreator(groupID, userID)
	if err != nil {
		t.Fatalf("2CheckGroupCreator() error = %v", err)
	}
	if exists {
		t.Fatalf("2CheckGroupCreator() returned true, expected false")
	}
}

func TestGetGroupByID(t *testing.T) {
	groupID := 1
	group, err := GetGroupByID(groupID)
	if err != nil {
		t.Fatalf("GetGroupByID() error = %v", err)
	}
	if group == nil {
		t.Fatal("GetGroupByID() returned nil group")
	}
}

func TestUpdateGroup(t *testing.T) {
	group := structs.Group{
		ID:           1,
		Title:        "Updated Title",
		Description:  "Updated Description",
		CreationDate: time.Now(),
	}
	err := UpdateGroup(group)
	if err != nil {
		t.Fatalf("UpdateGroup() error = %v", err)
	}
}

func TestAddInviteToGroup(t *testing.T) {
	err := AddInviteToGroup(2, 1)
	if err != nil {
		t.Fatalf("AddInviteToGroup() error = %v", err)
	}
}

func TestAddUserRequestJoinGroup(t *testing.T) {
	err := AddUserRequestJoinGroup(2, 1)
	if err != nil {
		t.Fatalf("AddUserRequestJoinGroup() error = %v", err)
	}
}

func TestGetUserInvites(t *testing.T) {
	userID := 1
	invites, err := GetUserInvites(userID)
	if err != nil {
		t.Fatalf("GetUserInvites() error = %v", err)
	}
	if len(invites) == 0 {
		t.Fatal("GetUserInvites() returned no invites")
	}
}

func TestUpdateInviteStatus(t *testing.T) {
	err := UpdateInviteStatus(1, 2, "Accepted")
	if err != nil {
		t.Fatalf("UpdateInviteStatus() error = %v", err)
	}
}

func TestUpdateRequestStatus(t *testing.T) {
	err := UpdateRequestStatus(1, 2, "Accepted")
	if err != nil {
		t.Fatalf("UpdateRequestStatus() error = %v", err)
	}
}

func TestGetGroupRequests(t *testing.T) {
	groupID := 2
	requests, err := GetGroupRequests(groupID)
	if err != nil {
		t.Fatalf("GetGroupRequests() error = %v", err)
	}
	if len(requests) == 0 {
		t.Fatal("GetGroupRequests() returned no requests")
	}
}

func TestAddMember(t *testing.T) {
	err := AddMember(2, 1)
	if err != nil {
		t.Fatalf("AddMember() error = %v", err)
	}
}
func TestCheckGroupMember(t *testing.T) {
	groupID := 2
	userID := 1

	// Assuming the user is a member of the group
	exists, err := CheckGroupMember(groupID, userID)
	if err != nil {
		t.Fatalf("CheckGroupMember() error = %v", err)
	}
	if !exists {
		t.Fatalf("CheckGroupMember() returned false, expected true")
	}

	// Assuming the user is not a member of the group
	groupID = 999
	exists, err = CheckGroupMember(groupID, userID)
	if err != nil {
		t.Fatalf("CheckGroupMember() error = %v", err)
	}
	if exists {
		t.Fatalf("CheckGroupMember() returned true, expected false")
	}
}

func TestGetGroupMembers(t *testing.T) {
	groupID := 2
	members, err := GetGroupMembers(groupID)
	if err != nil {
		t.Fatalf("GetGroupMembers() error = %v", err)
	}
	if len(members) == 0 {
		t.Fatal("GetGroupMembers() returned no members")
	}
}

func TestGetGroupsCreatedByTheUser(t *testing.T) {
	userID := 1
	groups, err := GetGroupsCreatedByTheUser(userID)
	if err != nil {
		t.Fatalf("GetGroupsCreatedByTheUser() error = %v", err)
	}
	if len(groups) == 0 {
		t.Fatal("GetGroupsCreatedByTheUser() returned no groups")
	}
}

func TestGetUserGroups(t *testing.T) {
	userID := 1
	groups, err := GetUserGroups(userID)
	if err != nil {
		t.Fatalf("GetUserGroups() error = %v", err)
	}
	if len(groups) == 0 {
		t.Fatal("GetUserGroups() returned no groups")
	}
}

func TestCreateEvent(t *testing.T) {
	event := structs.Event{
		GroupID:     1,
		CreatorID:   1,
		Title:       "Test Event",
		Description: "This is a test event",
		EventTime:   time.Now(),
	}

	_, err := CreateEvent(event)
	if err != nil {
		t.Fatalf("CreateEvent() error = %v", err)
	}
}

func TestUpdateEvent(t *testing.T) {
	event := structs.Event{
		ID:          1,
		GroupID:     1,
		CreatorID:   1,
		Title:       "Updated Event",
		Description: "This is an updated test event",
		EventTime:   time.Now(),
	}

	err := UpdateEvent(event)
	if err != nil {
		t.Fatalf("UpdateEvent() error = %v", err)
	}
}

func TestGetEventByID(t *testing.T) {
	eventID := 1
	event, err := GetEventByID(eventID)
	if err != nil {
		t.Fatalf("GetEventByID() error = %v", err)
	}
	if event == nil {
		t.Fatalf("GetEventByID() returned nil for event ID %d", eventID)
	}
}

func TestGetGroupEvents(t *testing.T) {
	groupID := 1
	events, err := GetGroupEvents(groupID)
	if err != nil {
		t.Fatalf("GetGroupEvents() error = %v", err)
	}
	if len(events) == 0 {
		t.Fatalf("GetGroupEvents() returned no events for group ID %d", groupID)
	}
}

func TestGetEventsByCreator(t *testing.T) {
	creatorID := 1
	events, err := GetEventsByCreator(creatorID)
	if err != nil {
		t.Fatalf("GetEventsByCreator() error = %v", err)
	}
	if len(events) == 0 {
		t.Fatalf("GetEventsByCreator() returned no events for creator ID %d", creatorID)
	}
}

func TestCreateEventResponse(t *testing.T) {
	response := structs.EventResponse{
		EventID: 1,
		UserID:  1,
	}

	err := CreateEventResponse(response)
	if err != nil {
		t.Fatalf("CreateEventResponse() error = %v", err)
	}
}

func TestGetEventResponsesByEventId(t *testing.T) {
	eventID := 1
	responses, err := GetEventResponsesByEventId(eventID)
	if err != nil {
		t.Fatalf("GetEventResponsesByEventId() error = %v", err)
	}
	if responses == nil {
		t.Fatalf("GetEventResponsesByEventId() returned nil for event ID %d", eventID)
	}
}

func TestGetEventByGroupAndCreator(t *testing.T) {
	groupID := 1
	creatorID := 1
	events, err := GetEventByGroupAndCreator(groupID, creatorID)
	if err != nil {
		t.Fatalf("GetEventByGroupAndCreator() error = %v", err)
	}
	if len(events) == 0 {
		t.Fatalf("GetEventByGroupAndCreator() returned no events for group ID %d and creator ID %d", groupID, creatorID)
	}
}

func TestGetEventResponsesByEventIdAndUserId(t *testing.T) {
	eventID := 1
	userID := 1
	responses, err := GetEventResponsesByEventIdAndUserId(eventID, userID)
	if err != nil {
		t.Fatalf("GetEventResponsesByEventIdAndUserId() error = %v", err)
	}
	if responses == nil {
		t.Fatalf("GetEventResponsesByEventIdAndUserId() returned nil for event ID %d and user ID %d", eventID, userID)
	}
}

func TestGetEventResponseByEventIdAndResponse(t *testing.T) {
	eventID := 1
	response := "Yes"
	responses, err := GetEventResponseByEventIdAndResponse(eventID, response)
	if err != nil {
		t.Fatalf("GetEventResponseByEventIdAndResponse() error = %v", err)
	}
	if responses == nil {
		t.Fatalf("GetEventResponseByEventIdAndResponse() returned nil for event ID %d and response %s", eventID, response)
	}
}

func TestGetUserEventsResponseByUserId(t *testing.T) {
	userID := 1
	responses, err := GetUserEventsResponseByUserId(userID)
	if err != nil {
		t.Fatalf("GetUserEventsResponseByUserId() error = %v", err)
	}
	if responses == nil {
		t.Fatalf("GetUserEventsResponseByUserId() returned nil for user ID %d", userID)
	}
}

func TestUpdateEventResponse(t *testing.T) {
	response := structs.EventResponse{
		ID:      1,
		EventID: 1,
		UserID:  1,
	}

	err := UpdateEventResponse(response)
	if err != nil {
		t.Fatalf("UpdateEventResponse() error = %v", err)
	}
}

func TestCreateGroupsNotification(t *testing.T) {
	entity := 1
	notification := structs.Notification{
		UserID:           1,
		GroupID:          &entity,
		NotificationType: "group",
		IsRead:           false,
	}
	err := CreateGroupsNotification(notification)
	if err != nil {
		t.Fatalf("CreateGroupsNotification() error = %v", err)
	}
}

func TestCreateEventsNotification(t *testing.T) {
	entity := 1

	notification := structs.Notification{
		UserID:           1,
		EventID:          &entity,
		NotificationType: "event",
		IsRead:           false,
	}
	err := CreateEventsNotification(notification)
	if err != nil {
		t.Fatalf("CreateEventsNotification() error = %v", err)
	}
}

func TestCreateMessagesNotification(t *testing.T) {
	entity := 1

	notification := structs.Notification{
		UserID:           1,
		SenderID:         &entity,
		NotificationType: "message",
		IsRead:           false,
	}
	err := CreateMessagesNotification(notification)
	if err != nil {
		t.Fatalf("CreateMessagesNotification() error = %v", err)
	}
}

func TestGetUserNotifications(t *testing.T) {
	notifications, err := GetUserNotifications(1)
	if err != nil {
		t.Fatalf("GetUserNotifications() error = %v", err)
	}
	if len(notifications) == 0 {
		t.Fatalf("GetUserNotifications() returned no notifications")
	}
}

func TestUpdateUserNotifications(t *testing.T) {
	err := UpdateUserNotifications(1)
	if err != nil {
		t.Fatalf("UpdateUserNotifications() error = %v", err)
	}
}

func TestUpdateNotificationToRead(t *testing.T) {
	err := UpdateNotificationToRead(1)
	if err != nil {
		t.Fatalf("UpdateNotificationToRead() error = %v", err)
	}
}

func TestCreateUserMessage(t *testing.T) {
	message := structs.UserChat{
		SenderID:   1,
		ReceiverID: 2,
		Message:    "Hello",
		ImageID:    0,
		IsRead:     false,
	}

	err := CreateUserMessage(message)
	if err != nil {
		t.Fatalf("CreateUserMessage() error = %v", err)
	}
}

func TestCreateGroupMessage(t *testing.T) {
	message := structs.GroupChat{
		GroupID:  1,
		SenderID: 1,
		Message:  "Hello Group",
	}

	err := CreateGroupMessage(message)
	if err != nil {
		t.Fatalf("CreateGroupMessage() error = %v", err)
	}
}

func TestUpdatePrivateMessageToRead(t *testing.T) {
	err := UpdatePrivateMessageToRead(1, 2)
	if err != nil {
		t.Fatalf("UpdatePrivateMessageToRead() error = %v", err)
	}
}

func TestUpdatePrivateMessage(t *testing.T) {
	message := structs.UserChat{
		ID:         1,
		SenderID:   1,
		ReceiverID: 2,
		Message:    "Updated Message",
		ImageID:    0,
		IsRead:     true,
	}

	err := UpdatePrivateMessage(message)
	if err != nil {
		t.Fatalf("UpdatePrivateMessage() error = %v", err)
	}
}

func TestUpdateGroupMessage(t *testing.T) {
	message := structs.GroupChat{
		ID:       1,
		GroupID:  1,
		SenderID: 1,
		Message:  "Updated Group Message",
	}

	err := UpdateGroupMessage(message)
	if err != nil {
		t.Fatalf("UpdateGroupMessage() error = %v", err)
	}
}

func TestGetUserMessages(t *testing.T) {
	messages, err := GetUserMessages(1, 2)
	if err != nil {
		t.Fatalf("GetUserMessages() error = %v", err)
	}
	if len(messages) == 0 {
		t.Fatalf("GetUserMessages() returned no messages")
	}
}

func TestGetGroupMessages(t *testing.T) {
	messages, err := GetGroupMessages(1)
	if err != nil {
		t.Fatalf("GetGroupMessages() error = %v", err)
	}
	if len(messages) == 0 {
		t.Fatalf("GetGroupMessages() returned no messages")
	}
}

func TestUploadImage(t *testing.T) {
	image := structs.Image{
		Data: []byte("test image data"),
	}

	_, err := UploadImage(image.Data)
	if err != nil {
		t.Fatalf("UploadImage() error = %v", err)
	}
}
func TestUpdateImage(t *testing.T) {
	err := UpdateImage(1, []byte("updated image data"))
	if err != nil {
		t.Fatalf("UpdateImage() error = %v", err)
	}
}
func TestGetImageByID(t *testing.T) {
	image, err := GetImageByID(1)
	if err != nil {
		t.Fatalf("GetImageByID() error = %v", err)
	}
	if image == nil {
		t.Fatalf("GetImageByID() returned nil")
	}
}

func TestCheckResponse(t *testing.T) {
	eventID := 1
	userID := 1

	// Assuming the response exists
	exists, err := CheckResponse(eventID, userID)
	if err != nil {
		t.Fatalf("CheckResponse() error = %v", err)
	}
	if !exists {
		t.Fatalf("CheckResponse() returned false, expected true")
	}

	// Assuming the response does not exist
	eventID = 999
	exists, err = CheckResponse(eventID, userID)
	if err != nil {
		t.Fatalf("CheckResponse() error = %v", err)
	}
	if exists {
		t.Fatalf("CheckResponse() returned true, expected false")
	}
}

func TestDeletePost(t *testing.T) {
	postID := 1
	err := DeletePost(postID)
	if err != nil {
		t.Errorf("DeletePost failed: %v", err)
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
func TestDeleteEventResponse(t *testing.T) {
	eventID := 1
	userID := 1
	err := DeleteEventResponse(eventID, userID)
	if err != nil {
		t.Fatalf("DeleteEventResponse() error = %v", err)
	}
}
func TestRemoveMember(t *testing.T) {
	err := RemoveMember(1, 2)
	if err != nil {
		t.Fatalf("RemoveMember() error = %v", err)
	}
}

func TestRemoveRequest(t *testing.T) {
	err := RemoveRequest(1, 2)
	if err != nil {
		t.Fatalf("RemoveRequest() error = %v", err)
	}
}

func TestRemoveInvite(t *testing.T) {
	err := RemoveInvite(1, 2)
	if err != nil {
		t.Fatalf("RemoveInvite() error = %v", err)
	}
}

func TestRemovePrivateMessage(t *testing.T) {
	message := structs.UserChat{
		ID: 1,
	}

	err := RemovePrivateMessage(message)
	if err != nil {
		t.Fatalf("RemovePrivateMessage() error = %v", err)
	}
}

func TestRemoveGroupMessage(t *testing.T) {
	message := structs.GroupChat{
		ID: 1,
	}

	err := RemoveGroupMessage(message)
	if err != nil {
		t.Fatalf("RemoveGroupMessage() error = %v", err)
	}
}

func TestRemoveEvent(t *testing.T) {
	eventID := 1
	err := RemoveEvent(eventID)
	if err != nil {
		t.Fatalf("RemoveEvent() error = %v", err)
	}
}

func TestDeleteUserSession(t *testing.T) {
	// Define a mock user ID to delete the session for
	userID := 1 // Replace with a valid user ID

	// Call the DeleteUserSession function
	err := DeleteUserSession(userID)
	if err != nil {
		t.Fatalf("Failed to delete user session: %v", err)
	}
}

func TestDeleteImage(t *testing.T) {
	err := DeleteImage(1)
	if err != nil {
		t.Fatalf("DeleteImage() error = %v", err)
	}
}

func TestDeleteUserNotifications(t *testing.T) {
	err := DeleteUserNotifications(1)
	if err != nil {
		t.Fatalf("DeleteUserNotifications() error = %v", err)
	}
}

func TestDeleteNotification(t *testing.T) {
	err := DeleteNotification(1)
	if err != nil {
		t.Fatalf("DeleteNotification() error = %v", err)
	}
}

func TestRemoveGroup(t *testing.T) {
	groupID := 1
	err := RemoveGroup(groupID)
	if err != nil {
		t.Fatalf("RemoveGroup() error = %v", err)
	}
}
