package models

import (
	"backend/pkg/structs"
	"fmt"
)

func CreateUserPost(p structs.Post) error {
	// Create a new record in the Post table
	columns := []string{"user_id", "content", "image_id", "privacy"}
	values := []interface{}{p.UserID, p.Content, p.ImageID, p.Privacy}
	return Create("Post", columns, values)
}

func CreateGroupPost(p structs.Post) error {
	// Create a new record in the Post table
	columns := []string{"group_id", "content", "image_id", "privacy"}
	values := []interface{}{p.GroupID, p.Content, p.ImageID, "public"}
	return Create("Post", columns, values)
}

func CreateComment(p structs.Post) error {
	// Create a new record in the Post table
	columns := []string{"user_id", "parent_id", "content", "image_id", "privacy"}
	values := []interface{}{p.UserID, p.ParentID, p.Content, p.ImageID, "public"}
	return Create("Post", columns, values)
}

func DeletePost(id int) error {
	// Execute a delete query to delete the post
	return Delete("Post", []string{"id"}, []interface{}{id})
}

func GetPostByID(id int) (*structs.Post, error) {
	// Execute a read query to fetch the post by ID
	rows, err := Read("Post", []string{"*"}, []string{"id"}, []interface{}{id})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	// Check if a result is found
	if !rows.Next() {
		return nil, nil // No post found, return nil without error
	}
	// Create a Post struct to hold the scanned data
	var post structs.Post
	// Scan the row into the Post struct fields
	err = rows.Scan(
		&post.ID,
		&post.UserID,
		&post.Content,
		&post.ImageID,
		&post.Privacy,
		&post.CreationDate,
		&post.ParentID,
		&post.GroupID,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning row: %v", err)
	}
	// Return the post struct if everything was successful
	return &post, nil
}

func GetGroupPosts(groupID int) ([]structs.Post, error) {
	return GetPosts(groupID, "group_id", -1)
}

// GetUserPosts retrieves posts for a user and filters them to include only top-level posts (ParentID = -1)
func GetUserPosts(userID int) ([]structs.Post, error) {
	return GetPosts(userID, "user_id", -1)
}

// GetUserPosts retrieves posts for a user and filters them to include only top-level posts (ParentID = -1)
func GetUserComments(userID int) ([]structs.Post, error) {
	// Retrieve posts for the given user ID
	return GetPosts(userID, "user_id", 1)
}

func GetPostComments(postID int) ([]structs.Post, error) {
	return GetPosts(postID, "parent_id", 1)
}

// GetPosts retrieves posts for a given ID and column, optionally filtering by parentID
func GetPosts(id int, column string, parentID int) ([]structs.Post, error) {
	// Define the WHERE clause and parameters
	whereClause := fmt.Sprintf("%s = ?", column)
	params := []interface{}{id}

	if parentID == -1 {
		// If parentID is -1, include posts with parent_id as NULL
		whereClause += " AND parent_id IS NULL"
	} else {
		// Otherwise, filter posts where parent_id IS NOT NULL
		whereClause += " AND parent_id IS NOT NULL"
	}

	// Execute a read query to fetch the posts by ID and optional parentID
	rows, err := Read("Post", []string{"*"}, []string{whereClause}, params)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Create a slice to hold the posts
	var posts []structs.Post

	// Iterate over the rows and scan each row into a Post struct
	for rows.Next() {
		var post structs.Post
		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
			&post.ParentID,
			&post.GroupID,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}

	// Return the posts if everything was successful
	return posts, nil
}

func UpdatePostPrivacy(postID int, privacy string) error {
	// Execute an update query to update the post privacy
	return Update("Post",
		[]string{"privacy"},    // Columns to set
		[]interface{}{privacy}, // Values to set
		[]string{"id"},         // Condition columns
		[]interface{}{postID},  // Condition values
	)
}

func AddPostRecipient(postID, recipientID int) error {
	// Create a new record in the Recipient table
	columns := []string{"post_id", "recipient_id"}
	values := []interface{}{postID, recipientID}
	return Create("Recipient", columns, values)
}

func RemovePostRecipient(postID, recipientID int) error {
	// Execute a delete query to remove the recipient
	return Delete("Recipient", []string{"post_id", "recipient_id"}, []interface{}{postID, recipientID})
}

func GetPostRecipients(postId int) ([]structs.Recipient, error) {
	// Execute a read query to fetch the post by ID
	rows, err := Read("Recipient", []string{"*"}, []string{"post_id"}, []interface{}{postId})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	// Create a slice to hold the recipients
	var recipients []structs.Recipient
	// Iterate over the rows and scan each row into a Recipient struct
	for rows.Next() {
		var recipient structs.Recipient
		err := rows.Scan(
			&recipient.ID,
			&recipient.PostID,
			&recipient.RecipientID,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		recipients = append(recipients, recipient)
	}
	// Return the recipients if everything was successful
	return recipients, nil
}

func GetPostReactions(postID int) ([]structs.Reaction, error) {
	// Execute a read query to fetch the post by ID
	rows, err := Read("Reaction", []string{"*"}, []string{"post_id"}, []interface{}{postID})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	// Create a slice to hold the reactions
	var reactions []structs.Reaction
	// Iterate over the rows and scan each row into a Reaction struct
	for rows.Next() {
		var reaction structs.Reaction
		err := rows.Scan(
			&reaction.ID,
			&reaction.UserID,
			&reaction.PostID,
			&reaction.ReactionType,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		reactions = append(reactions, reaction)
	}
	// Return the reactions if everything was successful
	return reactions, nil
}

func AddReaction(reaction structs.Reaction) error {
	// Define the table and columns
	tableName := "Reaction"
	// Define the condition to check for an existing reaction
	conditionColumns := []string{"user_id", "post_id"}
	conditionValues := []interface{}{reaction.UserID, reaction.PostID}

	// Check if the user has already reacted to the post
	existingReactions, err := Read(tableName, []string{"id"}, conditionColumns, conditionValues)
	if err != nil {
		return fmt.Errorf("error checking existing reactions: %v", err)
	}
	defer existingReactions.Close()

	// If an existing reaction is found, delete it
	if existingReactions.Next() {
		var reactionID int
		if err := existingReactions.Scan(&reactionID); err != nil {
			return fmt.Errorf("error scanning existing reaction: %v", err)
		}

		// Define the condition to delete the existing reaction
		deleteConditionColumns := []string{"id"}
		deleteConditionValues := []interface{}{reactionID}
		if err := Delete(tableName, deleteConditionColumns, deleteConditionValues); err != nil {
			return fmt.Errorf("error deleting existing reaction: %v", err)
		}
	}

	// Define the columns and values for the new reaction
	columns := []string{"user_id", "post_id", "reaction_type"}
	values := []interface{}{reaction.UserID, reaction.PostID, reaction.ReactionType}

	// Create the new reaction
	return Create(tableName, columns, values)
}

func DeleteReaction(userId, postId int) error {
	// Define the table and columns
	tableName := "Reaction"
	// Define the condition to delete the existing reaction
	deleteConditionColumns := []string{"post_id", "user_id"}
	deleteConditionValues := []interface{}{postId, userId}
	if err := Delete(tableName, deleteConditionColumns, deleteConditionValues); err != nil {
		return fmt.Errorf("error deleting existing reaction: %v", err)
	}
	return nil
}

func GetUserReactions(userId int) ([]structs.Reaction, error) {
	// Execute a read query to fetch the post by ID
	rows, err := Read("Reaction", []string{"*"}, []string{"user_id"}, []interface{}{userId})
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	// Create a slice to hold the reactions
	var reactions []structs.Reaction
	// Iterate over the rows and scan each row into a Reaction struct
	for rows.Next() {
		var reaction structs.Reaction
		err := rows.Scan(
			&reaction.ID,
			&reaction.UserID,
			&reaction.PostID,
			&reaction.ReactionType,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		reactions = append(reactions, reaction)
	}
	// Return the reactions if everything was successful
	return reactions, nil
}
