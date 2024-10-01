package models

import (
	"backend/pkg/db"
	"backend/pkg/structs"
	"fmt"
)

func CreateUserPost(p structs.Post) (int, error) {
	// Create a new record in the Post table
	columns := []string{"user_id", "content", "image_id", "privacy"}
	values := []interface{}{p.UserID, p.Content, p.ImageID, p.Privacy}
	err := Create("Post", columns, values)
	if err != nil {
		return 0, err
	}
	// Get the ID of the newly created post
	var postID int
	err = db.Database.QueryRow("SELECT id FROM Post WHERE user_id = ? AND content = ? AND image_id = ? AND privacy = ?", p.UserID, p.Content, p.ImageID, p.Privacy).Scan(&postID)
	if err != nil {
		return 0, err
	}
	return postID, nil
}

func CreateGroupPost(p structs.Post) error {
	// Create a new record in the Post table
	columns := []string{"user_id", "group_id", "content", "image_id", "privacy"}
	values := []interface{}{p.UserID, p.GroupID, p.Content, p.ImageID, "Public"}
	return Create("Post", columns, values)
}

func CreateNormalComment(p structs.Post) error {
	// Create a new record in the Post table
	columns := []string{"user_id", "parent_id", "content", "privacy"}
	values := []interface{}{p.UserID, p.ParentID, p.Content, "Public"}
	return Create("Post", columns, values)
}

func CreateGroupComment(p structs.Post) error {
	// Create a new record in the Post table
	columns := []string{"user_id", "group_id", "parent_id", "content", "privacy"}
	values := []interface{}{p.UserID, p.GroupID, p.ParentID, p.Content, "Public"}
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

	// Scan the row into the Post struct fields, handle NULL for nullable fields
	err = rows.Scan(
		&post.ID,
		&post.UserID,
		&post.GroupID, // Ensure *int can be scanned properly for nullable fields
		&post.ParentID,
		&post.Content,
		&post.ImageID,
		&post.Privacy,
		&post.CreationDate,
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
func GetUserPosts(Privacy string, userID int) ([]structs.Post, error) {
	if Privacy == "" {
		return GetPosts(userID, "group_id IS NULL AND user_id", -1)
	}
	return GetPosts(userID, fmt.Sprintf("Privacy = '%s' AND group_id IS NULL AND user_id", Privacy), -1)
}

// GetUserPosts retrieves posts for a user and filters them to include only top-level posts (ParentID = -1)
func GetUserComments(userID int) ([]structs.Post, error) {
	// Retrieve posts for the given user ID
	return GetPosts(userID, "group_id IS NULL AND user_id", 1)
}

func GetPostComments(postID int) ([]structs.Post, error) {
	return GetPosts(postID, "parent_id", 1)
}
func GetPosts(id int, column string, parentID int) ([]structs.Post, error) {
	// Define the WHERE clause and parameters
	whereClause := ""

	if parentID == -1 {
		// If parentID is -1, include posts with parent_id as NULL
		whereClause = "parent_id IS NULL AND " + column
	} else {
		// Otherwise, filter posts where parent_id IS NOT NULL
		whereClause += "parent_id IS NOT NULL AND " + column
	}

	// Execute a read query to fetch the posts by ID and optional parentID
	rows, err := Read("Post", []string{"*"}, []string{whereClause}, []interface{}{id})
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}

	// Check if any error occurred during row iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
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
			&reaction.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		reactions = append(reactions, reaction)
	}
	// Return the reactions if everything was successful
	return reactions, nil
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

func DeleteReactionById(reactionId int) error {
	// Define the table and columns
	tableName := "Reaction"
	// Define the condition to delete the existing reaction
	deleteConditionColumns := []string{"id"}
	deleteConditionValues := []interface{}{reactionId}
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

func AddReaction(reaction structs.Reaction) error {
	// Define the table name
	tableName := "Reaction"
	columns := []string{"user_id", "post_id", "reaction_type"}
	values := []interface{}{reaction.UserID, reaction.PostID, reaction.ReactionType}
	return Create(tableName, columns, values)
}

func GetAllPosts() ([]structs.Post, error) {
	tableName := "Post"
	columns := []string{"*"}
	rows, err := Read(tableName, columns, []string{}, []interface{}{})
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}
	// Return the posts if everything was successful
	return posts, nil
}

func GetLikedPosts(userId int) ([]structs.Post, error) {
	return GetPostsByReaction(userId, -1, "Like")
}

func GetDisLikedPosts(userId int) ([]structs.Post, error) {
	return GetPostsByReaction(userId, -1, "Dislike")
}

func GetPostsByReaction(userId, sessionUserId int, reaction string) ([]structs.Post, error) {
	query := fmt.Sprintf(`
    SELECT * FROM post WHERE id IN (
        SELECT post_id FROM reaction 
        WHERE user_id = ? AND reaction_type = '%s'
    ) AND (
        privacy = 'Public' 
        OR user_id = ? 
        OR id IN (
            SELECT post_id FROM Recipient WHERE recipient_id = ?
        )
        OR (privacy = 'Private' AND user_id IN (
            SELECT following_id FROM Follower WHERE follower_id = ?
        ))
    )`, reaction)
	rows, err := db.Database.Query(query, userId, sessionUserId, sessionUserId, sessionUserId)
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}

	// Check if any error occurred during row iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	// Return the posts if everything was successful
	return posts, nil
}

func GetPostsByReactionForGuest(userId, reaction string) ([]structs.Post, error) {
	query := fmt.Sprintf(`
    SELECT * FROM post WHERE id IN (
        SELECT post_id FROM reaction 
        WHERE user_id = ? AND reaction_type = '%s'
    ) AND (
        privacy = 'Public' 
    )`, reaction)
	rows, err := db.Database.Query(query, userId)
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}

	// Check if any error occurred during row iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	// Return the posts if everything was successful
	return posts, nil
}

func DidUserReact(userId, postId int, Reaction string) (bool, error) {
	rows, err := Read("Reaction", []string{"*"}, []string{"user_id", "post_id", "reaction_type"}, []interface{}{userId, postId, Reaction})
	if err != nil {
		return false, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()
	if rows.Next() {
		return true, nil
	}
	return false, nil
}

func GetGroupPostsForUser(userId int) ([]structs.Post, error) {
	query := `SELECT * FROM post WHERE group_id IN (
                SELECT group_id FROM GroupMember WHERE user_id = ?
              )`
	rows, err := db.Database.Query(query, userId)
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}
	// Return the posts if everything was successful
	return posts, nil
}

func GetPostsForUser(userId int) ([]structs.Post, error) {
	query := `
        SELECT * FROM Post WHERE privacy = 'Public'
		UNION
		SELECT * FROM Post WHERE user_id = ?
        UNION
        SELECT * FROM Post WHERE id IN (SELECT post_id FROM Recipient WHERE recipient_id = ?)
        UNION
        SELECT * FROM Post WHERE privacy = 'Private' AND user_id IN (SELECT following_id FROM Follower WHERE follower_id = ?)
    `
	rows, err := db.Database.Query(query, userId, userId, userId)
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}

	// Check if any error occurred during row iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	// Return the posts if everything was successful
	return posts, nil
}

func ProfilePagePosts(userId, FollowerID int) ([]structs.Post, error) {
	query := `
		SELECT * FROM Post WHERE user_id = ? AND privacy = 'Public'
        UNION
        SELECT * FROM Post WHERE user_id = ? AND id IN (SELECT post_id FROM Recipient WHERE recipient_id = ?) 
        UNION
        SELECT * FROM Post WHERE user_id = ? AND privacy = 'Private' AND user_id IN (SELECT following_id FROM Follower WHERE follower_id = ?)
    `
	rows, err := db.Database.Query(query, userId, userId, FollowerID, userId, FollowerID)
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
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		posts = append(posts, post)
	}

	// Check if any error occurred during row iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	// Return the posts if everything was successful
	return posts, nil
}

func SearchUserPosts(userId int, subString string) ([]structs.Post, error) {
	query := `SELECT * FROM Post WHERE (( content LIKE ? ) AND group_id IS NULL AND private = 'Public') OR (( content LIKE ? ) AND user_id = ?)`
	rows, err := db.Database.Query(query, "%"+subString+"%", "%"+subString+"%", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []structs.Post
	for rows.Next() {
		var post structs.Post
		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func SearchGroupPosts(subString string) ([]structs.Group, error) {
	query := `SELECT * FROM Post WHERE ( content LIKE ? ) AND group_id IS NOT NULL AND private = 'Public'`
	rows, err := db.Database.Query(query, "%"+subString+"%", "%"+subString+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var groups []structs.Group
	for rows.Next() {
		var group structs.Group
		err := rows.Scan(
			&group.ID,
			&group.CreatorID,
			&group.Title,
			&group.Description,
			&group.ImageID,
			&group.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}
	return groups, nil
}

func GetPostsForGuest() ([]structs.Post, error) {
	Rows, err := Read("Post", []string{"*"}, []string{"privacy"}, []interface{}{"Public"})
	if err != nil {
		return nil, err
	}
	defer Rows.Close()
	var posts []structs.Post
	for Rows.Next() {
		var post structs.Post
		err := Rows.Scan(
			&post.ID,
			&post.UserID,
			&post.GroupID,
			&post.ParentID,
			&post.Content,
			&post.ImageID,
			&post.Privacy,
			&post.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}
