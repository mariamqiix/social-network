package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func PostPageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	postID, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		log.Printf("error parsing post id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	post, err := models.GetPostByID(postID)
	if err != nil {
		log.Printf("error getting post: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	comments, err := models.GetPostComments(postID)
	if err != nil {
		log.Printf("error getting comments: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	User := ReturnUserResponse(sessionUser)
	view := PostPageView{
		User:     User,
		Posts:    mapPosts(sessionUser, []structs.Post{*post})[0],
		Comments: mapPosts(sessionUser, comments),
	}

	writeToJson(view, w)
}

func GroupPostsHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	groupID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing group id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	posts, err := models.GetGroupPosts(groupID)
	if err != nil {
		log.Printf("error getting posts: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	User := ReturnUserResponse(sessionUser)
	view := homeView{
		User:  User,
		Posts: mapPosts(sessionUser, posts),
	}

	writeToJson(view, w)
}

func AddReactionHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if sessionUser == nil {
		errorServer(w, http.StatusUnauthorized)
		return
	}
	var ReactoinRequest structs.ReactoinRequest
	err := json.NewDecoder(r.Body).Decode(ReactoinRequest)
	if err != nil {
		log.Printf("error unmarshalling data: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	didReact, err := models.CheckExistance("Rections", []string{"user_id", "post_id"}, []interface{}{sessionUser.ID, ReactoinRequest.PostID})
	if err != nil {
		log.Printf("error checking if user reacted: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	if didReact {
		err := models.DeleteReaction(sessionUser.ID, ReactoinRequest.PostID)
		if err != nil {
			log.Printf("error deleting reaction: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
		return
	}
	reaction := structs.Reaction{
		UserID:       sessionUser.ID,
		ReactionType: ReactoinRequest.Reaction,
		PostID:       ReactoinRequest.PostID,
	}
	err = models.AddReaction(reaction)
	if err != nil {
		log.Printf("error adding reaction: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func RemoveReactionHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if sessionUser == nil {
		errorServer(w, http.StatusUnauthorized)
		return
	}
	postId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("error parsing post id: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	err = models.DeleteReaction(sessionUser.ID, postId)
	if err != nil {
		log.Printf("error deleting reaction: %s\n", err.Error())
		errorServer(w, http.StatusInternalServerError)
		return
	}
}

func AddCommentHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if sessionUser == nil {
		errorServer(w, http.StatusUnauthorized)
		return
	}

	path := strings.Split(r.URL.Path, "/")

	switch path[2] {
	case "group":
		var comment structs.CommentGroupRequest
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			log.Printf("error unmarshalling data: %s\n", err.Error())
			errorServer(w, http.StatusBadRequest)
			return
		}
		exist, err := models.CheckExistance("Posts", []string{"id"}, []interface{}{comment.ParentID})
		if !exist {
			log.Printf("error checking if post exists: %s\n", err.Error())
			errorServer(w, http.StatusBadRequest)
			return
		}
		exist, err = models.CheckExistance("Groups", []string{"id"}, []interface{}{comment.GroupID})
		if !exist {
			log.Printf("error checking if group exists: %s\n", err.Error())
			errorServer(w, http.StatusBadRequest)
			return
		}
		post := structs.Post{
			UserID:   &sessionUser.ID,
			Content:  comment.Description,
			ParentID: &comment.ParentID,
			GroupID:  &comment.GroupID,
		}
		err = models.CreateGroupComment(post)
		if err != nil {
			log.Printf("error creating comment: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
	case "user":
		var comment structs.CommentRequest
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			log.Printf("error unmarshalling data: %s\n", err.Error())
			errorServer(w, http.StatusBadRequest)
			return
		}
		exist, err := models.CheckExistance("Posts", []string{"id"}, []interface{}{comment.ParentID})
		if !exist {
			log.Printf("error checking if post exists: %s\n", err.Error())
			errorServer(w, http.StatusBadRequest)
			return
		}
		post := structs.Post{
			UserID:   &sessionUser.ID,
			Content:  comment.Description,
			ParentID: &comment.ParentID,
		}
		err = models.CreateNormalComment(post)
		if err != nil {
			log.Printf("error creating comment: %s\n", err.Error())
			errorServer(w, http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
}

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)
	limiterUsername := "[GUESTS]"
	if sessionUser != nil {
		limiterUsername = sessionUser.Username
	}
	if !userLimiter.Allow(limiterUsername) {
		errorServer(w, http.StatusTooManyRequests)
		return
	}
	if sessionUser == nil {
		errorServer(w, http.StatusUnauthorized)
		return
	}
	var post structs.PostRequest
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		log.Printf("error unmarshalling data: %s\n", err.Error())
		errorServer(w, http.StatusBadRequest)
		return
	}
	imageID := 0
	if post.Image != nil {
		isImage, _ := IsDataImage(post.Image)
		if isImage {
			imageID, err = models.UploadImage(post.Image)
			if err != nil {
				log.Printf("SignupHandler: %s\n", err.Error())
			}
		}
	}
	postToCreate := structs.Post{
		UserID:  &sessionUser.ID,
		Content: post.Description,
		GroupID: &post.GroupID,
		ImageID: &imageID,
		Privacy: post.Privacy,
	}
}
