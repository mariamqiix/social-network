package models

import (
	"backend/pkg/structs"
)

func CreateNotification(userID int, sender_id, entityId *int, notificationType, notificationSender string, isRead bool) error {
	columns := []string{"user_id", "notification_type", notificationSender, "is_read", "sender_id"}
	values := []interface{}{userID, notificationType, entityId, isRead, sender_id}
	return Create("UserNotification", columns, values)
}

func CreateGroupEventNotification(userID int, sender_id, entityId *int, groupId int, notificationType string, isRead bool) error {
	columns := []string{"user_id", "notification_type", "event_id", "group_id", "is_read", "sender_id"}
	values := []interface{}{userID, notificationType, entityId, groupId, isRead, sender_id}
	return Create("UserNotification", columns, values)
}

func CreateGroupsNotification(notification structs.Notification) error {
	return CreateNotification(notification.UserID, notification.SenderID, notification.GroupID, notification.NotificationType, "group_id", notification.IsRead)
}

func CreateEventsNotification(notification structs.Notification) error {
	return CreateGroupEventNotification(notification.UserID, notification.SenderID, notification.EventID, *notification.GroupID, notification.NotificationType, notification.IsRead)
}

func CreateMessagesNotification(notification structs.Notification) error {
	return CreateNotification(notification.UserID, notification.SenderID, notification.SenderID, notification.NotificationType, "sender_id", notification.IsRead)
}

func GetUserNotifications(userId int) ([]structs.Notification, error) {
	rows, err := Read("UserNotification", []string{"*"}, []string{"user_id"}, []interface{}{userId})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []structs.Notification

	for rows.Next() {
		var notification structs.Notification
		err = rows.Scan(
			&notification.ID,
			&notification.UserID,
			&notification.SenderID,
			&notification.NotificationType,
			&notification.GroupID,
			&notification.EventID,
			&notification.IsRead,
			&notification.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}
	return notifications, nil
}

func UpdateUserNotifications(UserId int) error {
	return Update("UserNotification", []string{"is_read"}, []interface{}{true}, []string{"user_id"}, []interface{}{UserId})
}

func UpdateNotificationToRead(notificationId int) error {
	return Update("UserNotification", []string{"is_read"}, []interface{}{true}, []string{"id"}, []interface{}{notificationId})
}

func DeleteUserNotifications(userId int) error {
	return Delete("UserNotification", []string{"user_id"}, []interface{}{userId})
}

func DeleteNotification(notificationId int) error {
	return Delete("UserNotification", []string{"id"}, []interface{}{notificationId})
}

func DeleteNotificationByFollowRequest(notificationId,user_id int, notificationType string) error {
	return Delete("UserNotification", []string{"sender_id","user_id","notification_type"}, []interface{}{notificationId,user_id,notificationType})
}


func DeleteNotificationByGroupRequest(notificationId,group_id int, notificationType string) error {
	return Delete("UserNotification", []string{"sender_id","group_id","notification_type"}, []interface{}{notificationId,group_id,notificationType})
}
