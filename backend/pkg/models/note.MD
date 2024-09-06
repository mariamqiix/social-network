# Backend Models

This directory contains the models for the backend, which handle various operations related to users, groups, events, notifications, posts, images, and messages.

## Functions

### user.go

-   **CreateUser**: `u structs.User` -> `error` - Creates a new user.
-   **GetUserByID**: `id int` -> `(*structs.User, error)` - Retrieves a user by their ID.
-   **GetUserByEmail**: `email string` -> `(*structs.User, error)` - Retrieves a user by their email.
-   **UpdateUser**: `u structs.User` -> `error` - Updates user information.
-   **DeleteUser**: `id int` -> `error` - Deletes a user by their ID.
-   **GetAllUsers** -> `([]structs.User, error)` - Retrieves all users.
-   **AuthenticateUser**: `email, password string` -> `(bool, error)` - Authenticates a user by their email and password.
-   **GetUserFriends**: `userID int` -> `([]structs.User, error)` - Retrieves friends of a user.
-   **AddFriend**: `userID, friendID int` -> `error` - Adds a friend to a user.
-   **RemoveFriend**: `userID, friendID int` -> `error` - Removes a friend from a user.
-   **GetUserGroups**: `userID int` -> `([]structs.Group, error)` - Retrieves groups a user is a member of.
-   **GetUserEvents**: `userID int` -> `([]structs.Event, error)` - Retrieves events a user is participating in.
-   **GetUserNotifications**: `userID int` -> `([]structs.Notification, error)` - Retrieves notifications for a user.
-   **UpdateUserPassword**: `userID int, newPassword string` -> `error` - Updates the password for a user.
-   **GetUserPosts**: `userID int` -> `([]structs.Post, error)` - Retrieves posts created by a user.
-   **GetUserComments**: `userID int` -> `([]structs.Comment, error)` - Retrieves comments made by a user.
-   **GetUserReactions**: `userID int` -> `([]structs.Reaction, error)` - Retrieves reactions made by a user.

### posts.go

-   **CreateUserPost**: `p structs.Post` -> `error` - Creates a user post.
-   **CreateGroupPost**: `p structs.Post` -> `error` - Creates a group post.
-   **CreateComment**: `p structs.Post` -> `error` - Creates a comment on a post.
-   **DeletePost**: `id int` -> `error` - Deletes a post.
-   **GetPostByID**: `id int` -> `(*structs.Post, error)` - Retrieves a post by its ID.
-   **GetGroupPosts**: `groupID int` -> `([]structs.Post, error)` - Retrieves posts in a group.
-   **GetUserPosts**: `userID int` -> `([]structs.Post, error)` - Retrieves posts for a user.
-   **GetUserComments**: `userID int` -> `([]structs.Post, error)` - Retrieves comments for a user.
-   **GetPostComments**: `postID int` -> `([]structs.Post, error)` - Retrieves comments on a post.
-   **GetPosts**: `id int, column string, parentID int` -> `([]structs.Post, error)` - Retrieves posts based on criteria.
-   **UpdatePostPrivacy**: `postID int, privacy string` -> `error` - Updates the privacy of a post.
-   **AddPostRecipient**: `postID, recipientID int` -> `error` - Adds a recipient to a post.
-   **RemovePostRecipient**: `postID, recipientID int` -> `error` - Removes a recipient from a post.
-   **GetPostRecipients**: `postId int` -> `([]structs.Recipient, error)` - Retrieves recipients of a post.
-   **GetPostReactions**: `postID int` -> `([]structs.Reaction, error)` - Retrieves reactions to a post.
-   **DeleteReaction**: `userId, postId int` -> `error` - Deletes a reaction to a post.
-   **DeleteReactionById**: `reactionId int` -> `error` - Deletes a reaction by its ID.
-   **GetUserReactions**: `userId int` -> `([]structs.Reaction, error)` - Retrieves reactions by a user.
-   **AddReaction**: `reaction structs.Reaction` -> `error` - Adds a reaction to a post.
-   **GetAllPosts** -> `([]structs.Post, error)` - Retrieves all posts.

### group.go

-   **CreateGroup**: `g structs.Group` -> `error` - Creates a group.
-   **RemoveGroup**: `id int` -> `error` - Removes a group.
-   **GetGroupByID**: `id int` -> `(*structs.Group, error)` - Retrieves a group by its ID.
-   **UpdateGroup**: `g structs.Group` -> `error` - Updates a group.
-   **AddMember**: `groupID, userID int` -> `error` - Adds a member to a group.
-   **RemoveMember**: `groupID, userID int` -> `error` - Removes a member from a group.
-   **AddInviteToGroup**: `groupID, userID int` -> `error` - Adds an invite to a group.
-   **AddUserRequestJoinGroup**: `groupID, userID int` -> `error` - Adds a user request to join a group.
-   **InsertToRequestTable**: `groupId, userId int, RequestType string` -> `error` - Inserts a request into the request table.
-   **RemoveInvite**: `groupID, userID int` -> `error` - Removes an invite from a group.
-   **UpdateInviteStatus**: `groupID, userID int, status string` -> `error` - Updates the status of an invite.
-   **RemoveRequest**: `groupID, userID int` -> `error` - Removes a request from a group.
-   **UpdateRequestStatus**: `groupID, userID int, status string` -> `error` - Updates the status of a request.
-   **GetGroupRequests**: `groupID int` -> `([]structs.GroupRequest, error)` - Retrieves requests for a group.
-   **GetGroupMembers**: `groupID int` -> `([]structs.GroupMember, error)` - Retrieves members of a group.
-   **GetUserInvites**: `userID int` -> `([]structs.GroupRequest, error)` - Retrieves group invites for a user.
-   **GetGroupsCreatedByTheUser**: `userID int` -> `([]structs.Group, error)` - Retrieves groups created by a user.
-   **GetUserGroups**: `userID int` -> `([]structs.GroupMember, error)` - Retrieves groups a user is a member of.
-   **GetAllGroups** -> `([]structs.Group, error)` - Retrieves all groups.
-   **GetGroupTitleById**: `groupID int` -> `(string, error)` - Retrieves the title of a group by its ID.
-   **CheckGroupMember**: `groupID, userID int` -> `(bool, error)` - Checks if a user is a member of a group.
-   **CheckGroupCreator**: `groupID, userID int` -> `(bool, error)` - Checks if a user is the creator of a group.

### chats.go

-   **CreateUserMessage**: `message structs.UserChat` -> `error` - Creates a user message.
-   **CreateGroupMessage**: `message structs.GroupChat` -> `error` - Creates a group message.
-   **UpdatePrivateMessageToRead**: `UserID, ReceiverId int` -> `error` - Updates a private message to read status.
-   **UpdatePrivateMessage**: `Message structs.UserChat` -> `error` - Updates a private message.
-   **UpdateGroupMessage**: `Message structs.GroupChat` -> `error` - Updates a group message.
-   **RemovePrivateMessage**: `Message structs.UserChat` -> `error` - Removes a private message.
-   **RemoveGroupMessage**: `Message structs.GroupChat` -> `error` - Removes a group message.
-   **GetUserMessages**: `UserId, ReceiverId int` -> `([]structs.UserChat, error)` - Retrieves user messages between two users.
-   **GetGroupMessages**: `GroupID int` -> `([]structs.GroupChat, error)` - Retrieves messages in a group.

### event.go

-   **CreateEvent**: `e structs.Event` -> `error` - Creates an event.
-   **UpdateEvent**: `e structs.Event` -> `error` - Updates an event.
-   **UpdateEventTime**: `id int, eventTime time.Time` -> `error` - Updates the time of an event.
-   **GetEventByID**: `id int` -> `(*structs.Event, error)` - Retrieves an event by its ID.
-   **GetGroupEvents**: `groupID int` -> `([]structs.Event, error)` - Retrieves events for a group.
-   **GetEventsByCreator**: `creatorID int` -> `([]structs.Event, error)` - Retrieves events created by a user.
-   **GetEventByGroupAndCreator**: `groupID, creatorID int` -> `([]structs.Event, error)` - Retrieves events by group and creator.
-   **CreateEventResponse**: `r structs.EventResponse` -> `error` - Creates a response to an event.
-   **UpdateEventResponse**: `r structs.EventResponse` -> `error` - Updates a response to an event.
-   **GetEventResponsesByEventId**: `eventID int` -> `(*structs.EventResponse, error)` - Retrieves responses to an event by event ID.
-   **GetUserEventsResponseByUserId**: `userID int` -> `([]structs.EventResponse, error)` - Retrieves event responses by user ID.
-   **GetEventResponsesByEventIdAndUserId**: `eventID, userID int` -> `(*structs.EventResponse, error)` - Retrieves event responses by event ID and user ID.
-   **GetEventResponseByEventIdAndResponse**: `eventID int, response string` -> `(*[]structs.EventResponse, error)` - Retrieves event responses by event ID and response.
-   **DeleteEventResponse**: `eventID, userID int` -> `error` - Deletes an event response.
-   **RemoveEvent**: `id int` -> `error` - Removes an event.
-   **CheckResponse**: `eventID, userID int` -> `(bool, error)` - Checks if a response exists for an event by a user.

### notification.go

-   **CreateNotification**: `userID int, entityId *int, notificationType, notificationSender string, isRead bool` -> `error` - Creates a notification.
-   **CreateGroupsNotification**: `notification structs.Notification` -> `error` - Creates a group notification.
-   **CreateEventsNotification**: `notification structs.Notification` -> `error` - Creates an event notification.
-   **CreateMessagesNotification**: `notification structs.Notification` -> `error` - Creates a message notification.
-   **GetUserNotifications**: `userId int` -> `([]structs.Notification, error)` - Retrieves notifications for a user.
-   **UpdateUserNotifications**: `UserId int` -> `error` - Updates notifications for a user.
-   **UpdateNotificationToRead**: `notificationId int` -> `error` - Updates a notification to read status.
-   **DeleteUserNotifications**: `userId int` -> `error` - Deletes notifications for a user.
-   **DeleteNotification**: `notificationId int` -> `error` - Deletes a notification.

### image.go

-   **UploadImage**: `image structs.Image` -> `error` - Uploads an image.
-   **DeleteImage**: `imageID int` -> `error` - Deletes an image.
-   **GetImageByID**: `imageID int` -> `(*structs.Image, error)` - Retrieves an image by its ID.
-   **UpdateImage**: `imageID int, imageData []byte` -> `error` - Updates an image.
