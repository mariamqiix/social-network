package models

import (
	"backend/pkg/structs"
	"fmt"
)

func CreateUserMessage(message structs.UserChat) error {
	columns := []string{"sender_id", "receiver_id", "message", "image_id", "is_read"}
	values := []interface{}{message.SenderID, message.ReceiverID, message.Message, message.ImageID, message.IsRead}
	return Create("UserChat", columns, values)
}

func CreateGroupMessage(message structs.GroupChat) error {
	columns := []string{"group_id", "sender_id", "message", "image_id"}
	values := []interface{}{message.GroupID, message.SenderID, message.Message, message.ImageID}
	return Create("GroupChat", columns, values)
}

func UpdatePrivateMessageToRead(UserID, ReceiverId int) error {
	columnsToSet := []string{"is_read"}
	valuesToSet := []interface{}{true}
	conditionColumns := []string{"sender_id", "receiver_id"}
	conditionValues := []interface{}{ReceiverId, UserID}
	return Update("UserChat", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func UpdatePrivateMessage(Message structs.UserChat) error {
	columnsToSet := []string{"message"}
	valuesToSet := []interface{}{Message.Message}
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{Message.ID}
	return Update("UserChat", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func UpdateGroupMessage(Message structs.GroupChat) error {
	columnsToSet := []string{"message"}
	valuesToSet := []interface{}{Message.Message}
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{Message.ID}
	return Update("GroupChat", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}
func RemovePrivateMessage(Message structs.UserChat) error {
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{Message.ID}
	return Delete("UserChat", conditionColumns, conditionValues)
}

func RemoveGroupMessage(Message structs.GroupChat) error {
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{Message.ID}
	return Delete("GroupChat", conditionColumns, conditionValues)
}

func GetUserMessages(UserId, ReceiverId int) ([]structs.UserChat, error) {
	conditionColumns := []string{fmt.Sprintf("sender_id = %d AND receiver_id = %d OR sender_id = %d AND receiver_id", UserId, ReceiverId, ReceiverId)}
	conditionValues := []interface{}{UserId}
	rows, err := Read("UserChat", []string{"*"}, conditionColumns, conditionValues)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Initialize a slice to hold the messages
	var messages []structs.UserChat

	// Iterate over the result set and scan the rows into the messages slice
	for rows.Next() {
		var message structs.UserChat
		err = rows.Scan(
			&message.ID,
			&message.SenderID,
			&message.ReceiverID,
			&message.Message,
			&message.ImageID,
			&message.IsRead,
			&message.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		messages = append(messages, message)
	}

	// Return the messages slice
	return messages, nil
}

func GetGroupMessages(GroupID int) ([]structs.GroupChat, error) {
	conditionColumns := []string{"group_id"}
	conditionValues := []interface{}{GroupID}
	rows, err := Read("GroupChat", []string{"*"}, conditionColumns, conditionValues)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	// Initialize a slice to hold the messages
	var messages []structs.GroupChat

	// Iterate over the result set and scan the rows into the messages slice
	for rows.Next() {
		var message structs.GroupChat
		err = rows.Scan(
			&message.ID,
			&message.GroupID,
			&message.SenderID,
			&message.Message,
			&message.ImageID,
			&message.CreationDate,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		messages = append(messages, message)
	}

	// Return the messages slice
	return messages, nil
}