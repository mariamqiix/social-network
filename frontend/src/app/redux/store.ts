import { createStore } from "redux";
import { Notifi, Post, State, ChatMessage, Chat } from "../types/Types";
import { addMessage, addNotification } from "./actions";
import { addNotificationFunction } from "../components/get_notification";

const initialState: State = {
    posts: [],
    chats: [],
    selectedChat: null,
    messages: [],
    notifications: [],
    user: null,
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'posts/add':
            if (state.posts.some((post: Post) => post.id == action.payload.id)) {
                for (let i = 0; i < state.posts.length; i++) {
                    if (state.posts[i].id == action.payload.id) {
                        state.posts[i] = action.payload;
                    }
                }
                return {
                    ...state,
                    posts: [...state.posts]
                };
            } else {
                return {
                    ...state,
                    posts: [action.payload, ...state.posts]
                };
            }
        case "posts/like":
            if (state.posts.some((post: Post) => post.id == action.payload.id)) {
                for (let i = 0; i < state.posts.length; i++) {
                    if (state.posts[i].id == action.payload.id) {
                        state.posts[i].likes += action.payload.value;
                    }
                }
                return {
                    ...state,
                    posts: [...state.posts]
                };
            }
            return {
                ...state,
                posts: [...state.posts]
            };
        case 'chats/add':
            console.log(action.payload);
            if (state.chats.some((chat: Chat) => chat.id == action.payload.id && chat.type == action.payload.type)) {
                for (let i = 0; i < state.chats.length; i++) {
                    if (state.chats[i].id == action.payload.id && state.chats[i].type == action.payload.type) {
                        state.chats[i] = action.payload;
                    }
                }
                return {
                    ...state,
                    chats: [...state.chats]
                };
            } else {
                return {
                    ...state,
                    chats: [action.payload, ...state.chats]
                };
            }
        case 'chat/select':
            return {
                ...state,
                selectedChat: action.payload,
                messages: []
            };
        case 'message/add':
            let messageId = state.messages.findIndex((mes) => ((mes.id + mes.created_at + mes.content) == (action.payload.id + action.payload.created_at + action.payload.content)));
            if (state.selectedChat) {
                if (messageId > -1) {
                    state.messages[messageId] = action.payload;
                    return {
                        ...state,
                        messages: [...state.messages]
                    };
                } else if (action.payload.sender.name == state.user!.username || ((state.selectedChat.type == "user" && action.payload.type == "user" && state.selectedChat.name == action.payload.sender.name) || (state.selectedChat.type == "group" && action.payload.type == "group" && state.selectedChat.name == action.payload.group_name))) {
                    return {
                        ...state,
                        messages: [action.payload, ...state.messages]
                    };
                }
            }
        case 'notifications/add':
            if (action.payload.id == 0) {
                action.payload.id = Math.floor(Math.random() * 1000) + state.notifications.length;
            }
            if (state.notifications.some((not: Notifi) => not.id == action.payload.id)) {
                for (let i = 0; i < state.notifications.length; i++) {
                    if (state.notifications[i].id == action.payload.id) {
                        state.notifications[i] = action.payload;
                    }
                }
                return {
                    ...state,
                    notifications: [...state.notifications]
                };
            } else {
                return {
                    ...state,
                    notifications: [action.payload, ...state.notifications]
                };
            }
        case 'notifications/remove':
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id != action.payload),
            };
        case 'notifications/hideToast':
            return {
                ...state,
                notifications: state.notifications.map(not => {
                    if (not.id == action.payload) {
                        return { ...not, showToast: false };
                    } else {
                        return not;
                    }
                })
            };
        case 'user/login':
            return {
                ...state,
                user: action.payload,
            }
        case "user/logout":
            return initialState;
        default:
            return state;
    }
}

const store = createStore(reducer);
export default store;


let interval: NodeJS.Timeout | null = null;
function connectWebsocket() {
    const newSocket = new WebSocket('ws://localhost:8080/socket');
    if (interval) {
        clearInterval(interval);
        interval = null;
        // console.log("socket reconnected");
    } else {
        console.log("socket created");
    }
    newSocket.onmessage = (event) => {
        // console.log("socket received: ", event.data);
        try {
            let data = JSON.parse(event.data);
            if (data.message_type == "Notification") {
                store.dispatch(addNotification({ id: data.notification.id, type: "message", title: data.notification.type, message: data.notification.message, link: "", showToast: true, function: addNotificationFunction(data.notification) }));
            } else if (data.message_type == "User") {
                store.dispatch(addMessage({ id: data.user_chat.id, content: data.user_chat.content, created_at: data.user_chat.created_at, image_url: "data:image/jpeg;base64," + data.user_chat.image_url, sender: { name: data.user_chat.Sender.username, avatar: "data:image/jpeg;base64," + data.user_chat.Sender.image_url }, type: "user", group_name: null },));
            } else if (data.message_type == "Group") {
                store.dispatch(addMessage({ id: data.group_chat.id, content: data.group_chat.content, created_at: data.group_chat.created_at, image_url: "data:image/jpeg;base64," + data.group_chat.image_url, sender: { name: data.group_chat.Sender.username, avatar: "data:image/jpeg;base64," + data.group_chat.Sender.image_url }, type: "group", group_name: data.group_chat.group_id }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    newSocket.addEventListener("close", (event) => {
        // console.error("socket closed");
        interval = setInterval(() => {
            socket = connectWebsocket();
        }, 1000);
    });
    return newSocket;
}
export let socket = connectWebsocket();