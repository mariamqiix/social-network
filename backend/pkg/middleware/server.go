package middleware

import (
	"backend/pkg/models"
	"backend/pkg/structs"
	"fmt"
	"net/http"
)

var userLimiter *UserRateLimiter

func GoLive() {
	userLimiter = NewUserRateLimiter()
	mux := http.NewServeMux()

	mux.HandleFunc("/", HomePageHandler)
	mux.HandleFunc("/postPage", PostPageHandler) //  DONE >>>>>	return the group Page view || checked
	mux.HandleFunc("/login", LoginHandler)       //  DONE >>>>>	login function || checked
	mux.HandleFunc("/logout", LogoutHandler)
	// mux.HandleFunc("/signup", SignupHandler)
	mux.HandleFunc("/socket", websocketHandler)

	// ///// the /post api's
	mux.HandleFunc("/post/", PostHandler)
	// mux.HandleFunc("/post/addReaction", AddReactionHandler)       //  DONE >>>>>	to add a reaction to a post || checked
	// mux.HandleFunc("/post/removeReaction", RemoveReactionHandler) //  DONE >>>>>	to remove a reaction from a post || checked
	// mux.HandleFunc("/post/addComment/", AddCommentHandler)        //  Done >>>>>	to add a comment to a post || checked
	// mux.HandleFunc("/post/createPost/", CreatePostHandler)        //  DONE >>>>>	to create a post || checked

	///// the /group api's
	mux.HandleFunc("/group/", GroupHandler)
	// mux.HandleFunc("/group/messages", GroupChatsHandler)                    //  DONE >>>>>	to return the messages between two users  || checked
	// mux.HandleFunc("/group/list/", GroupsHandler)                           //  DONE >>>>>	list to all groups/requested/invited/joined groups || checked
	// mux.HandleFunc("/group/createGroup", CreateGroupHandler)                //  DONE >>>>>	to create a group || checked
	// mux.HandleFunc("/group/requestToJoin", JoinGroupHandler)                //  DONE >>>>>	to request joing a group || checked
	// mux.HandleFunc("/group/leaveGroup", LeaveGroupHandler)                  //  DONE >>>>>	to leave a group || checked
	// mux.HandleFunc("/group/page", GroupPageHandler)                         //  DONE >>>>>	to return the group page || checked
	// mux.HandleFunc("/group/inviteUser", InviteUserHandler)                  //  DONE >>>>>	to Add user Invite || checked
	// mux.HandleFunc("/group/event/list/", ListEventHandler)                  //  DONE >>>>>	to list the events , all the events for the user in the groups page , and the group event for the group page || checked
	// mux.HandleFunc("/group/event/create", CreateEventHandler)               //  DONE >>>>>	to create an event || checked
	// mux.HandleFunc("/group/event/userResponse", CreateEventResponseHandler)

	///// the /user api's
	mux.HandleFunc("/user/profile/", ProfilePageHandler)
	mux.HandleFunc("/user/notifications/", NotificationsHandler)
	mux.HandleFunc("/user/responds/", UserResponde)

	mux.HandleFunc("/user/userMessages/{id}", UserChatHandler) // to return the messages between two users
	mux.HandleFunc("/user/Chats", UserChatsHandler)            // to return the chats of the user

	//mux.HandleFunc("/user/usersAbleToChat", UserAbleToChatHandler) //// to return the users that can be talked with
	// mux.HandleFunc("/user/getUpdateUserInformation", UpdateUserInformationHandler)        // to return the user information that will be showen in the front
	// mux.HandleFunc("/user/postUpdateUserInformation", UpdateUserInformationHandler)       // to update the user information
	corsWrappedMux := Cors(mux)

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", corsWrappedMux)
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
