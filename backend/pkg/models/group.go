package models

import (
	"backend/pkg/structs"
	"fmt"
)

func CreateGroup(g structs.Group) error {
	// Create a new record in the Group table
	columns := []string{"creator_id", "title", "description"}
	values := []interface{}{g.CreatorID, g.Title, g.Description}
	return Create("GroupTable", columns, values)
}

func RemoveGroup(id int) error {
	// Execute a delete query to delete the group
	return Delete("GroupTable", []string{"id"}, []interface{}{id})
}

func GetGroupByID(id int) (*structs.Group, error) {
	// Execute a read query to fetch the group by ID
	rows, err := Read("GroupTable", []string{"*"}, []string{"id"}, []interface{}{id})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Check if a result is found
	if !rows.Next() {
		return nil, nil // No group found, return nil without error
	}

	// Create a Group struct to hold the scanned data
	var group structs.Group

	// Scan the row into the Group struct fields
	err = rows.Scan(
		&group.ID,
		&group.CreatorID,
		&group.Title,
		&group.Description,
		&group.CreationDate,
	)
	if err != nil {
		return nil, err
	}
	// Return the group struct if everything was successful
	return &group, nil
}

func UpdateGroup(g structs.Group) error {
	// Update the group with the specified ID
	return Update("GroupTable", []string{"title", "description"}, []interface{}{g.Title, g.Description}, []string{"id"}, []interface{}{g.ID})
}

func AddMember(groupID, userID int) error {
	// Create a new record in the Member table
	columns := []string{"group_id", "user_id"}
	values := []interface{}{groupID, userID}
	return Create("GroupMember", columns, values)
}

func RemoveMember(groupID, userID int) error {
	// Execute a delete query to remove the member
	return Delete("GroupMember", []string{"group_id", "user_id"}, []interface{}{groupID, userID})
}

func AddInviteToGroup(groupID, userID int) error {
	return InsertToRequestTable(groupID, userID, "Invite")
}

func AddUserRequestJoinGroup(groupID, userID int) error {
	return InsertToRequestTable(groupID, userID, "Request")
}

func InsertToRequestTable(groupId, userId int, RequestType string) error {
	// Create a new record in the Invite table
	columns := []string{"group_id", "user_id", "type"}
	values := []interface{}{groupId, userId, RequestType}
	return Create("GroupRequest", columns, values)
}

func RemoveInvite(groupID, userID int) error {
	// Execute a delete query to remove the invite
	return Delete("GroupRequest", []string{"group_id", "user_id", "type"}, []interface{}{groupID, userID, "Invite"})
}

func UpdateInviteStatus(groupID, userID int, status string) error {
	// Update the invite status
	return Update("GroupRequest", []string{"status"}, []interface{}{status}, []string{"group_id", "user_id", "type"}, []interface{}{groupID, userID, "Invite"})
}

func RemoveRequest(groupID, userID int) error {
	// Execute a delete query to remove the invite
	return Delete("GroupRequest", []string{"group_id", "user_id", "type"}, []interface{}{groupID, userID, "Request"})
}

func UpdateRequestStatus(groupID, userID int, status string) error {
	// Update the invite status
	return Update("GroupRequest", []string{"status"}, []interface{}{status}, []string{"group_id", "user_id", "type"}, []interface{}{groupID, userID, "Request"})
}

func GetGroupRequests(groupID int) ([]structs.GroupRequest, error) {
	// Execute a read query to fetch the group requests
	rows, err := Read("GroupRequest", []string{"*"}, []string{"group_id", "type"}, []interface{}{groupID, "Request"})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the group requests
	var requests []structs.GroupRequest

	// Iterate over the rows and scan each row into a GroupRequest struct
	for rows.Next() {
		var request structs.GroupRequest
		err := rows.Scan(
			&request.ID,
			&request.GroupID,
			&request.UserID,
			&request.Status,
			&request.Type,
			&request.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		requests = append(requests, request)
	}
	// Return the group requests if everything was successful
	return requests, nil
}

func GetGroupMembers(groupID int) ([]structs.GroupMember, error) {
	// Execute a read query to fetch the group members
	rows, err := Read("GroupMember", []string{"*"}, []string{"group_id"}, []interface{}{groupID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	// Create a slice to hold the group members
	var members []structs.GroupMember
	// Iterate over the rows and scan each row into a Member struct
	for rows.Next() {
		var member structs.GroupMember
		err := rows.Scan(
			&member.ID,
			&member.GroupID,
			&member.UserID,
		)
		if err != nil {
			return nil, err
		}
		members = append(members, member)
	}
	// Return the group members if everything was successful
	return members, nil
}

// GetUserInvites fetches all group invites for a given user.
func GetUserInvites(userID int) ([]structs.GroupRequest, error) {
	// Execute a read query to fetch the group requests for the user with type 'Invite'
	rows, err := Read("GroupRequest", []string{"*"}, []string{"user_id", "type"}, []interface{}{userID, "Invite"})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the group requests
	var requests []structs.GroupRequest

	// Iterate over the rows and scan each row into a GroupRequest struct
	for rows.Next() {
		fmt.Print("hello")
		var request structs.GroupRequest
		err := rows.Scan(
			&request.ID,
			&request.GroupID,
			&request.UserID,
			&request.Status,
			&request.Type,
			&request.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		requests = append(requests, request)
	}

	// Check if there was an error after iterating
	if err = rows.Err(); err != nil {
		return nil, err
	}

	// Return the group requests if everything was successful
	return requests, nil
}

func GetGroupsCreatedByTheUser(userID int) ([]structs.Group, error) {
	// Execute a read query to fetch the group requests
	rows, err := Read("GroupTable", []string{"*"}, []string{"creator_id"}, []interface{}{userID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	// Create a slice to hold the group requests
	var groups []structs.Group
	// Iterate over the rows and scan each row into a Group struct
	for rows.Next() {
		var group structs.Group
		err := rows.Scan(
			&group.ID,
			&group.CreatorID,
			&group.Title,
			&group.Description,
			&group.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}
	// Return the group requests if everything was successful
	return groups, nil
}

func GetUserGroups(userID int) ([]structs.GroupMember, error) {
	// Execute a read query to fetch the group requests
	rows, err := Read("GroupMember", []string{"*"}, []string{"user_id"}, []interface{}{userID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	// Create a slice to hold the group requests
	var groups []structs.GroupMember
	// Iterate over the rows and scan each row into a Group struct
	for rows.Next() {
		var group structs.GroupMember
		err := rows.Scan(
			&group.ID,
			&group.GroupID,
			&group.UserID,
		)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}
	// Return the group requests if everything was successful
	return groups, nil
}

func GetAllGroups() ([]structs.Group, error) {
	// Execute a read query to fetch all groups
	rows, err := Read("GroupTable", []string{"*"}, []string{}, []interface{}{})
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	// Create a slice to hold the groups
	var groups []structs.Group
	// Iterate over the rows and scan each row into a Group struct
	for rows.Next() {
		var group structs.Group
		err := rows.Scan(
			&group.ID,
			&group.CreatorID,
			&group.Title,
			&group.Description,
			&group.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}
	// Return the groups if everything was successful
	return groups, nil
}
