package models

import (
	"backend/pkg/db"
	"backend/pkg/structs"
	"log"
	"time"
)

func CreateEvent(e structs.Event) (int, error) {
	columns := []string{"group_id", "creator_id", "title", "event_description", "event_time"}
	values := []interface{}{e.GroupID, e.CreatorID, e.Title, e.Description, e.EventTime}
	err := Create("EventTable", columns, values)
	if err != nil {
		log.Printf("error creating event: %s\n", err.Error())
		return 0, err
	}
	var eventID int
	err = db.Database.QueryRow("SELECT id FROM EventTable WHERE group_id = ? AND creator_id = ? AND title = ? AND event_description = ? AND event_time = ?", e.GroupID, e.CreatorID, e.Title, e.Description, e.EventTime).Scan(&eventID)
	if err != nil {
		log.Printf("error getting event ID: %s\n", err.Error())
		return 0, err
	}
	return eventID, nil
}

func UpdateEvent(e structs.Event) error {
	columnsToSet := []string{"group_id", "creator_id", "title", "event_description", "event_time"}
	valuesToSet := []interface{}{e.GroupID, e.CreatorID, e.Title, e.Description, e.EventTime}
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{e.ID}
	return Update("EventTable", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func UpdateEventTime(id int, eventTime time.Time) error {
	columnsToSet := []string{"event_time"}
	valuesToSet := []interface{}{eventTime}
	conditionColumns := []string{"id"}
	conditionValues := []interface{}{id}
	return Update("EventTable", columnsToSet, valuesToSet, conditionColumns, conditionValues)
}

func GetEventByID(id int) (*structs.Event, error) {
	rows, err := Read("EventTable", []string{"*"}, []string{"id"}, []interface{}{id})
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
	rows, err := Read("EventTable", []string{"*"}, []string{"group_id"}, []interface{}{groupID})
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
	rows, err := Read("EventTable", []string{"*"}, []string{"creator_id"}, []interface{}{creatorID})
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
	rows, err := Read("EventTable", []string{"*"}, []string{"group_id", "creator_id"}, []interface{}{groupID, creatorID})
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
	columns := []string{"event_id", "user_id", "response_id"}
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

func GetEventResponsesByEventId(eventID int) ([]structs.EventResponse, error) {
	rows, err := Read("EventResponse", []string{"*"}, []string{"event_id"}, []interface{}{eventID})
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
	return responses, nil
}

func GetEventResponsesByEventIdAndEventOptionId(eventID, option int) ([]structs.EventResponse, error) {
	rows, err := Read("EventResponse", []string{"*"}, []string{"event_id", "response_id"}, []interface{}{eventID, option})
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
	return Delete("EventTable", []string{"id"}, []interface{}{id})
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

func GetUserEvents(userID int) ([]structs.Event, error) {
	query := `SELECT * FROM EventTable WHERE group_id IN (SELECT group_id FROM GroupMember WHERE user_id = ?) AND event_time > datetime('now')`
	rows, err := db.Database.Query(query, userID)
	if err != nil {
		log.Printf("error getting user events: %s\n", err.Error())
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
			log.Printf("error scanning event row: %s\n", err.Error())
			return nil, err
		}
		events = append(events, event)
	}

	if err = rows.Err(); err != nil {
		log.Printf("error iterating over event rows: %s\n", err.Error())
		return nil, err
	}

	return events, nil
}

func AddEventOption(eventID int, optionID,IconName string) error {
	columns := []string{"event_id", "option_name","Icon_name"}
	values := []interface{}{eventID, optionID,IconName}
	return Create("EventOptions", columns, values)
}

func GetEventOptions(eventID int) ([]structs.EventOptions, error) {
	rows, err := Read("EventOptions", []string{"*"}, []string{"event_id"}, []interface{}{eventID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var options []structs.EventOptions
	for rows.Next() {
		var option structs.EventOptions
		err = rows.Scan(
			&option.ID,
			&option.EventID,
			&option.OptionName,
			&option.IconName,
		)
		if err != nil {
			return nil, err
		}
		options = append(options, option)
	}
	return options, nil
}

func GetEventOptionCount(eventID, OptionID int) (int, error) {
	rows, err := Read("EventOptions", []string{"COUNT(*)"}, []string{"event_id", "response_id"}, []interface{}{eventID, OptionID})
	if err != nil {
		return 0, err
	}
	defer rows.Close()
	if !rows.Next() {
		return 0, nil
	}
	var count int
	err = rows.Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
