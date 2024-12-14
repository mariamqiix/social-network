package middleware

import (
	// "RealTimeForum/models"

	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	// "strconv"
	// "strings"
	"github.com/gorilla/websocket"
)

type Connection struct {
	ID         int
	connection *websocket.Conn
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var connections []Connection
var emptyString = ""

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()
	user := GetUser(r)
	if user == nil {
		return
	}
	connection := Connection{
		ID:         user.ID,
		connection: conn,
	}
	connections = append(connections, connection)
	defer func() {
		RemoveConnection(user.ID)
	}()
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			// log.Println("Error reading message:", err)
			return
		}
		MessageRequest := BodyToMessage(p)
		if MessageRequest == nil {
			log.Println("Message is nil or invalid.")
			continue
		}
		// fmt.Println(MessageRequest)
		SenderId, err := models.GetUserByUsername(MessageRequest.SenderUsername)
		// fmt.Println(SenderId)
		if err != nil {
			log.Println("Error getting user by username:", err)
			continue
		}
		if SenderId == nil {
			continue
		}
		// fmt.Println(MessageRequest)
		if MessageRequest.Type == "GroupMessage" {
			isExist, err := models.CheckExistance("GroupTable", []string{"id"}, []interface{}{MessageRequest.GroupID})
			if err != nil || !isExist {
				errorServer(w, http.StatusInternalServerError)
				continue
			}
			imageId := 0
			if MessageRequest.Image != nil {
				imageBytes, err := base64.StdEncoding.DecodeString(*MessageRequest.Image)
				if err != nil {
					fmt.Println("Error decoding base64 image:", err)
				}
				id, err := models.UploadImage(imageBytes)
				if err != nil {
					fmt.Println(err)
				}
				imageId = id
			}
			message := structs.GroupChat{
				SenderID:     SenderId.ID,
				GroupID:      MessageRequest.GroupID,
				Message:      MessageRequest.Message,
				ImageID:      &imageId,
				CreationDate: time.Now(),
			}
			err = models.CreateGroupMessage(message)
			if err != nil {
				fmt.Println(err)
				continue
			}
			groupMembers, err := models.GetGroupMembers(MessageRequest.GroupID)
			if err != nil {
				errorServer(w, http.StatusInternalServerError)
				continue
			}
			for _, member := range groupMembers {
				reciver := ReturnBasicUser(member.UserID)
				if MessageRequest.Image == nil {
					MessageRequest.Image = &emptyString
				}
				err := SendMessageToGroupOrUser(SenderId.ID, MessageRequest.GroupID, MessageRequest.Message, reciver.Username, "GroupMessage", (MessageRequest.Image), imageId)
				if err != nil {
					fmt.Print(err)
					continue
				}
			}

		} else {
			err := SendMessageToGroupOrUser(SenderId.ID, 0, MessageRequest.Message, MessageRequest.ReceiverId, "UserMessage", (MessageRequest.Image), -1)
			if err != nil {
				fmt.Print(err)
				continue
			}
		}

	}
}

func SendMessageToGroupOrUser(SenderId, GroupID int, Message, ReceiverUsername, MessageType string, image *string, imageID int) error {
	ReceiverId, err := models.GetUserByUsername(ReceiverUsername)
	if err != nil {
		return err
	}
	if ReceiverId == nil {
		return fmt.Errorf("user with username %s not found", ReceiverUsername)
	}
	if MessageType == "GroupMessage" {
		message := structs.GroupChat{
			SenderID:     SenderId,
			GroupID:      GroupID,
			Message:      Message,
			ImageID:      &imageID,
			CreationDate: time.Now(),
		}
		receiverConnections, ok := GetConnectionByID(ReceiverId.ID)
		if !ok {
			return fmt.Errorf("no connection found for the user with id: %d\n", ReceiverId.ID)
		}
		group, _ := models.GetGroupByID(GroupID)
		newMessageStruct := structs.WebsocketResponse{
			MessageType: "Group",
			GroupChat: structs.GroupChatResponse{
				Sender:       *ReturnBasicUser(message.SenderID),
				Sended:       false,
				Content:      message.Message,
				GroupID:      group.Title,
				Image:        *image,
				CreationDate: message.CreationDate,
			},
		}
		SendMessage(*receiverConnections, &newMessageStruct)
	} else {
		imageId := 0
		if image != nil {
			imageBytes, err := base64.StdEncoding.DecodeString(*image)
			if err != nil {
				fmt.Println("Error decoding base64 image:", err)
				return err
			}
			id, err := models.UploadImage(imageBytes)
			if err != nil {
				return err
			}
			imageId = id
		}
		message := structs.UserChat{
			SenderID:     SenderId,
			ReceiverID:   ReceiverId.ID,
			Message:      Message,
			IsRead:       false,
			ImageID:      &imageId,
			CreationDate: time.Now(),
		}
		err = models.CreateUserMessage(message)
		if err != nil {
			return err
		}
		reciverConnections, ok := GetConnectionByID(message.ReceiverID)
		if !ok {
			fmt.Println("No connection found for the user with id:", message.ReceiverID)
			return fmt.Errorf("no connection found for the user with id: %d", message.ReceiverID)
		}
		// image, err := models.GetImageByID(*message.ImageID)
		// if err != nil {
		// 	return err
		// }
		// imageData := ""
		// if image != nil {
		// 	imageData = string(image.Data)
		// }

		if image == nil {
			image = &emptyString
		}
		newMessageStruct := structs.WebsocketResponse{
			MessageType: "User",
			UserChat: structs.ChatResponse{
				Sender:       *ReturnBasicUser(message.SenderID),
				Receiver:     *ReturnBasicUser(message.ReceiverID),
				Content:      message.Message,
				Image:        *image,
				CreationDate: message.CreationDate,
			},
		}
		SendMessage(*reciverConnections, &newMessageStruct)
	}

	return nil
}

func SendMessage(conn Connection, message *structs.WebsocketResponse) {
	b, err := json.Marshal(message)
	if err != nil {
		log.Println("Error wrapping the message to bytes. " + err.Error())
		conn.connection.Close()
		RemoveConnection(conn.ID)
	}
	err = conn.connection.WriteMessage(websocket.TextMessage, b)
	if err != nil {
		log.Println("Error writting the message into the Web Socket. ", err.Error())
		conn.connection.Close()
		RemoveConnection(conn.ID)
	}
}

func BodyToMessage(body []byte) *structs.MessageRequest {
	if len(body) == 0 {
		return nil
	}
	var message structs.MessageRequest
	err := json.Unmarshal(body, &message)
	if err != nil {
		log.Println(err)
		return nil
	}
	return &message
}

// RemoveConnection removes a connection by its ID
func RemoveConnection(userID int) {
	for i, conn := range connections {
		if conn.ID == userID {
			connections = append(connections[:i], connections[i+1:]...)
			break
		}
	}
}

// GetConnectionByID returns the connection where the ID matches the recipientID
func GetConnectionByID(recipientID int) (*Connection, bool) {
	for _, conn := range connections {
		if conn.ID == recipientID {
			return &conn, true
		}
	}
	return nil, false
}

func IsUserOnline(userID int) bool {
	_, ok := GetConnectionByID(userID)
	return ok
}

func SendNotification(id int, notification structs.NotificatoinResponse) {
	conn, ok := GetConnectionByID(id)
	if !ok {
		return
	}
	newNotification := structs.WebsocketResponse{
		MessageType:  "Notification",
		Notification: notification,
	}
	SendMessage(*conn, &newNotification)
}

func CheckUserOnlineHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("userID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid userID", http.StatusBadRequest)
		return
	}
	if IsUserOnline(userID) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("User is online"))
	} else {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User is offline"))
	}
}
