package models

import (
	"backend/pkg/structs"
	"time"
)

func CreateEvent(e structs.Event) error {
	columns := []string{"group_id", "creator_id", "title", "description", "event_time"}
	values := []interface{}{e.GroupID, e.CreatorID, e.Title, e.Description, e.EventTime}
	return Create("Event", columns, values)
}

func UpdateEvent(e structs.Event) error {
	columnsToSet := []string{"group_id", "creator_id", "title", "description", "event_time"}
	valuesToSet := []interface{}{e.GroupID, e.CreatorID, e.Title, e.Description, e.EventTime}
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{e.ID}
	return Update("Event", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func UpdateEventTime(id int, eventTime time.Time) error {
	columnsToSet := []string{"event_time"}
	valuesToSet := []interface{}{eventTime}
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{id}
	return Update("Event", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func GetEventByID(id int) (*structs.Event, error) {
	rows, err := Read("Event", []string{"*"}, []string{"id"}, []interface{}{id})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, nil
	}

	var event structs.Event

	err = rows.Scan(
		&event.ID,
		&event.GroupID,
		&event.CreatorID,
		&event.Title,
		&event.Description,
		&event.EventTime,
		&event.CreationDate,
	)
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func GetGroupEvents(groupID int) ([]structs.Event, error) {
	rows, err := Read("Event", []string{"*"}, []string{"group_id"}, []interface{}{groupID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []structs.Event

	for rows.Next() {
		var event structs.Event
		err = rows.Scan(
			&event.ID,
			&event.GroupID,
			&event.CreatorID,
			&event.Title,
			&event.Description,
			&event.EventTime,
			&event.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	return events, nil
}

func GetEventsByCreator(creatorID int) ([]structs.Event, error) {
	rows, err := Read("Event", []string{"*"}, []string{"creator_id"}, []interface{}{creatorID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []structs.Event

	for rows.Next() {
		var event structs.Event
		err = rows.Scan(
			&event.ID,
			&event.GroupID,
			&event.CreatorID,
			&event.Title,
			&event.Description,
			&event.EventTime,
			&event.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	return events, nil
}

func GetEventByGroupAndCreator(groupID, creatorID int) ([]structs.Event, error) {
	rows, err := Read("Event", []string{"*"}, []string{"group_id", "creator_id"}, []interface{}{groupID, creatorID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []structs.Event

	for rows.Next() {
		var event structs.Event
		err = rows.Scan(
			&event.ID,
			&event.GroupID,
			&event.CreatorID,
			&event.Title,
			&event.Description,
			&event.EventTime,
			&event.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	return events, nil
}

func CreateEventResponse(r structs.EventResponse) error {
	columns := []string{"event_id", "user_id", "response"}
	values := []interface{}{r.EventID, r.UserID, r.Response}
	return Create("EventResponse", columns, values)
}

func UpdateEventResponse(r structs.EventResponse) error {
	columnsToSet := []string{"response"}
	valuesToSet := []interface{}{r.Response}
	conditionColumns := []string{"event_id", "user_id"}
	conditionValues := []interface{}{r.EventID, r.UserID}
	return Update("EventResponse", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func GetEventResponsesByEventId(eventID int) (*structs.EventResponse, error) {
	rows, err := Read("EventResponse", []string{"*"}, []string{"event_id"}, []interface{}{eventID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, nil
	}

	var response structs.EventResponse

	err = rows.Scan(
		&response.ID,
		&response.EventID,
		&response.UserID,
		&response.Response,
		&response.ResponseDate,
	)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func GetUserEventsResponseByUserId(userID int) ([]structs.EventResponse, error) {
	rows, err := Read("EventResponse", []string{"*"}, []string{"user_id"}, []interface{}{userID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var responses []structs.EventResponse

	for rows.Next() {
		var response structs.EventResponse
		err = rows.Scan(
			&response.ID,
			&response.EventID,
			&response.UserID,
			&response.Response,
			&response.ResponseDate,
		)
		if err != nil {
			return nil, err
		}
		responses = append(responses, response)
	}
	return responses, nil
}

func GetEventResponsesByEventIdAndUserId(eventID, userID int) (*structs.EventResponse, error) {
	rows, err := Read("EventResponse", []string{"*"}, []string{"event_id", "user_id"}, []interface{}{eventID, userID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, nil
	}

	var response structs.EventResponse

	err = rows.Scan(
		&response.ID,
		&response.EventID,
		&response.UserID,
		&response.Response,
		&response.ResponseDate,
	)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func GetEventResponseByEventIdAndResponse(eventID int, response string) (*[]structs.EventResponse, error) {
	rows, err := Read("EventResponse", []string{"*"}, []string{"event_id", "response"}, []interface{}{eventID, response})
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	if !rows.Next() {
		return nil, nil
	}
	var responses []structs.EventResponse
	for rows.Next() {
		var response structs.EventResponse
		err = rows.Scan(
			&response.ID,
			&response.EventID,
			&response.UserID,
			&response.Response,
			&response.ResponseDate,
		)
		if err != nil {
			return nil, err
		}
		responses = append(responses, response)
	}
	return &responses, nil
}

func DeleteEventResponse(eventID, userID int) error {
	conditionColumns := []string{"event_id", "user_id"}
	conditionValues := []interface{}{eventID, userID}
	return Delete("EventResponse", conditionColumns, conditionValues)
}

func RemoveEvent(id int) error {
	return Delete("Event", []string{"id"}, []interface{}{id})
}

func CheckResponse(eventID, userID int) (bool, error) {
	rows, err := Read("EventResponse", []string{"response"}, []string{"event_id", "user_id"}, []interface{}{eventID, userID})
	if err != nil {
		return false, err
	}
	defer rows.Close()
	defer rows.Close()
	if !rows.Next() {
		return false, nil
	}
	return true, nil
}

