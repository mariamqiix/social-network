package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"fmt"
	"net/http"
)

var userLimiter *UserRateLimiter

func GoLive() {

	http.HandleFunc("/", HomePageHandler)
	http.HandleFunc("/postPage/{id}", PostPageHandler)
	http.HandleFunc("/login", LoginHandler)
	http.HandleFunc("/logout", LogoutHandler)
	// http.HandleFunc("/signup", SignupHandler)
	// http.HandleFunc("/socket", socketHanddler)

	// ///// the /post api's
	http.HandleFunc("/post/addReaction", AddReactionHandler)       //  DONE >>>>>	to add a reaction to a post
	http.HandleFunc("/post/removeReaction", RemoveReactionHandler) //  DONE >>>>>	to remove a reaction from a post
	http.HandleFunc("/post/addComment", AddCommentHandler)         //  Done >>>>>>	to add a comment to a post
	http.HandleFunc("/post/createPost", CreatePostHandler)

	///// the /group api's
	http.HandleFunc("/group/Messages/{id}", GroupChatsHandler)     //  DONE >>>>>	to return the messages between two users
	http.HandleFunc("/group/list", GroupsHandler)                  //  DONE >>>>>	list to all groups/requested/invited/joined groups
	http.HandleFunc("/group/createGroup", CreateGroupHandler)      //  DONE >>>>>	to create a group
	http.HandleFunc("/group/requestToJoin/{id}", JoinGroupHandler) //  DONE >>>>>	to request joing a group
	http.HandleFunc("/group/leaveGroup/{id}", LeaveGroupHandler)   //  DONE >>>>>	to leave a group
	http.HandleFunc("/group/page/{id}", GroupPageHandler)          //  DONE >>>>>	to return the group page
	http.HandleFunc("/group/inviteUser", InviteUserHandler)        //  DONE >>>>>	to Add user Invite
	http.HandleFunc("/group/event/list", ListEventHandler)         //  DONE >>>>>	to list the events , all the events for the user in the groups page , and the group event for the group page
	http.HandleFunc("/group/event/create", CreateEventHandler)     //  DONE >>>>>	to create an event
	// http.HandleFunc("/group/event/userResponse", JoinEventHandler)       //  DONE >>>>>	to join an event

	///// the /user api's
	http.HandleFunc("/user/profile", ProfilePageHandler)
	http.HandleFunc("/user/profile/followers", ProfilePageHandler)
	http.HandleFunc("/user/profile/followeing", ProfilePageHandler)
	http.HandleFunc("/user/profile/like", ProfilePageHandler)
	http.HandleFunc("/user/profile/dislike", ProfilePageHandler)
	http.HandleFunc("/user/userMessages/{id}", UserChatHandler) // to return the messages between two users
	// http.HandleFunc("/user/usersAbleToChat", UserAbleToChatHandler)                        // to return the users that can be talked with
	// http.HandleFunc("/user/Chats", UserChatsHandler)                                       // to return the chats of the user
	// http.HandleFunc("/user/getUpdateUserInformation", UpdateUserInformationHandler)        // to return the user information that will be showen in the front
	// http.HandleFunc("/user/postUpdateUserInformation", UpdateUserInformationHandler)       // to update the user information
	// http.HandleFunc("/user/notifications", NotificationsHandler)                           // to return the notifications of the user
	// http.HandleFunc("/user/notifications/groupInviteResponse", NotificationsHandler)       // to return the notifications of the user
	// http.HandleFunc("/user/notifications/adminGroupRequestResponse", NotificationsHandler) // to return the notifications of the user
	// http.HandleFunc("/user/notifications/followResponse", NotificationsHandler)            // to return the notifications of the user
	// http.HandleFunc("/user/requestToFollow", FollowUserHandler)                            // to request to follow a user

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	sessionUser := GetUser(r)

	view := homeView{
		Posts: nil,
		User:  nil,
	}

	if sessionUser != nil {
		view.User = &structs.UserResponse{
			Id:          sessionUser.ID,
			Username:    sessionUser.Username,
			Nickname:    *sessionUser.Nickname,
			Email:       sessionUser.Email,
			FirstName:   sessionUser.FirstName,
			LastName:    sessionUser.LastName,
			DateOfBirth: sessionUser.DateOfBirth,
			Bio:         *sessionUser.Bio,
			Image:       GetImageData(sessionUser.ImageID), // will use it as url(data:image/jpeg;base64,base64string)
		}
	}

	var posts []structs.Post
	var err error
	if sessionUser != nil {
		posts, err = models.GetPostsForUser(sessionUser.ID)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
	} else {
		posts, err = models.GetPostsForGuest()
		fmt.Print(posts)
		if err != nil {
			errorServer(w, http.StatusInternalServerError)
			return
		}
	}
	view.Posts = mapPosts(sessionUser, posts)
	writeToJson(view, w)
}