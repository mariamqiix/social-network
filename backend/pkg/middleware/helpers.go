package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
)

func GetUser(r *http.Request) *structs.User {
	sessionCookie, err := r.Cookie("session")
	if err == http.ErrNoCookie {
		return nil
	}
	sessionExists, _ := models.CheckExistance("UserSession", []string{"token"}, []interface{}{sessionCookie.Value})
	if !sessionExists {
		return nil
	}
	session, err := models.GetSession(sessionCookie.Value)
	if err != nil {
		log.Printf("error getting session: %s\n", err.Error())
		return nil
	}
	// a nill foreign key means the user is a guest
	if session.UserID == nil {
		return &structs.User{
			UserType: "Guest",
		}
	}
	user, err := models.GetUserByID(*session.UserID)
	if err != nil {
		log.Printf("error getting user by user id: %s\n", err.Error())
		return nil
	}
	return user
}

func writeToJson(v any, w http.ResponseWriter) error {
	buff, err := json.Marshal(v)
	if err != nil {
		return err
	}
	w.Header().Add("Content-Type", "application/json")
	_, err = w.Write(buff)
	return err
}

func GetImageData(imageID int) string {
	// Retrieve the image data from the database
	imageData, err := models.GetImageByID(imageID)
	if err != nil {
		return ""
	}

	if imageData == nil {
		return ""
	}

	// Encode the image data to base64
	base64Image := base64.StdEncoding.EncodeToString(imageData.Data)
	return base64Image
}

func mapPosts(sessionuser *structs.User, posts []structs.Post) []structs.PostResponse {
	var postResponses []structs.PostResponse
	for _, post := range posts {
		user, err := models.GetUserByID(*post.UserID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}

		var Group *structs.GroupResponse
		if post.GroupID != nil {
			group, err := models.GetGroupByID(*post.GroupID)
			if err != nil {
				log.Printf("error getting group by group id: %s\n", err.Error())
				continue
			}
			user, err = models.GetUserByID(group.CreatorID)
			if err != nil {
				log.Printf("error getting user by user id: %s\n", err.Error())
				continue
			}
			IsUserMember, err := models.CheckExistance("GroupMember", []string{"group_id", "user_id"}, []interface{}{group.ID, user.ID})
			if err != nil {
				log.Printf("error checking if user is member of group: %s\n", err.Error())
				continue
			}
			GroupCreator := ReturnUserResponse(user)
			Group = &structs.GroupResponse{
				Id:           group.ID,
				Creator:      *GroupCreator,
				Title:        group.Title,
				Description:  group.Description,
				IsUserMember: IsUserMember,
				Image:        GetImageData(group.ImageID),
				CreationDate: group.CreationDate,
			}
		}
		auther := ReturnUserResponse(user)
		postResponses = append(postResponses, structs.PostResponse{
			Id:           post.ID,
			Author:       *auther,
			Group:        *Group,
			Content:      post.Content,
			Image:        GetImageData(post.ImageID),
			Privacy:      post.Privacy,
			CreationDate: post.CreationDate,
			Likes:        *MapReaction(sessionuser, &post, "Like"),
			Dislikes:     *MapReaction(sessionuser, &post, "Dislike"),
		})
	}
	return postResponses
}

func ReturnUserResponse(user *structs.User) *structs.UserResponse {
	if user == nil {
		return nil
	}
	userResponse := structs.UserResponse{
		Id:          user.ID,
		Username:    user.Username,
		Nickname:    *user.Nickname,
		Email:       user.Email,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		DateOfBirth: user.DateOfBirth,
		Bio:         *user.Bio,
		Image:       GetImageData(*user.ImageID), // will use it as url(data:image/jpeg;base64,base64string)
	}
	return &userResponse
}

func MapReaction(User *structs.User, post *structs.Post, reactionType string) *structs.ReactionResponse {
	didUserReact, err := models.DidUserReact(post.ID, User.ID, reactionType)
	if err != nil {
		log.Printf("error getting reaction by post id and user id: %s\n", err.Error())
		return nil
	}
	count, err := models.GetPostReactions(post.ID)
	if err != nil {
		log.Printf("error counting reactions by post id: %s\n", err.Error())
		return nil
	}
	return &structs.ReactionResponse{
		DidUserReact: didUserReact,
		Count:        len(count),
	}

}

func mapGroups(sessionUser structs.User, groups []structs.Group) []structs.GroupResponse {
	var groupResponses []structs.GroupResponse
	for _, group := range groups {
		user, err := models.GetUserByID(group.CreatorID)
		if err != nil {
			log.Printf("error getting user by user id: %s\n", err.Error())
			continue
		}
		IsUserMember, err := models.CheckExistance("GroupMember", []string{"group_id", "user_id"}, []interface{}{group.ID, sessionUser.ID})
		if err != nil {
			log.Printf("error checking if user is member of group: %s\n", err.Error())
			continue
		}
		GroupCreator := ReturnUserResponse(user)
		groupResponses = append(groupResponses, structs.GroupResponse{
			Id:           group.ID,
			Creator:      *GroupCreator,
			Title:        group.Title,
			Description:  group.Description,
			IsUserMember: IsUserMember,
			Image:        GetImageData(group.ImageID),
			CreationDate: group.CreationDate,
		})
	}
	return groupResponses
}
