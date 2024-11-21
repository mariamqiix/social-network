import { createStore } from "redux";
import { Notifi, Post, State, ChatMessage, Chat } from "../types/Types";
import { addMessage, addNotification } from "./actions";
import { addNotificationFunction } from "../notifications/get_notification";

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
            if (state.chats.some((chat: Chat) => chat.id == action.payload.id)) {
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
            if (messageId > -1) {
                state.messages[messageId] = action.payload;
                return {
                    ...state,
                    messages: [...state.messages]
                };
            } else if (state.user?.username == action.payload.sender.name || ((state.selectedChat?.name == action.payload.sender.name && state.selectedChat?.type == "user") || state.selectedChat?.id == action.payload.group_name)) {
                return {
                    ...state,
                    messages: [action.payload, ...state.messages]
                };
            }
        case 'notifications/add':
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

export const socket = new WebSocket('ws://127.0.0.1:8080/socket');
console.log("socket created: ", socket);
socket.onmessage = (event) => {
    // setMessages((prevMessages) => [...prevMessages, event.data]);
    console.log("socket received: ", event.data);
    try {
        let data = JSON.parse(event.data);
        console.log(data);
        console.log(data.message_type);
        if (data.message_type == "Notification") {
            store.dispatch(addNotification({ id: data.notification.id, type: "message", title: data.notification.type, message: data.notification.message, link: "", showToast: true, function: addNotificationFunction(data) }));
        } else if (data.message_type == "User") {
            store.dispatch(addMessage({ id: data.user_chat.id, content: data.user_chat.content, created_at: data.user_chat.created_at, image_url: "data:image/jpeg;base64," + data.user_chat.image_url, sender: { name: data.user_chat.Sender.username, avatar: "data:image/jpeg;base64," + data.user_chat.Sender.image_url }, type: "user", group_name: null },));
        } else if (data.message_type == "Group") {
            store.dispatch(addMessage({ id: data.group_chat.id, content: data.group_chat.content, created_at: data.group_chat.created_at, image_url: "data:image/jpeg;base64," + data.group_chat.image_url, sender: { name: data.group_chat.Sender.username, avatar: "data:image/jpeg;base64," + data.group_chat.Sender.image_url }, type: "group", group_name: data.group_chat.group_id }));
        }
    } catch (error) {
        console.error(error);
    }
};

socket.addEventListener("error", (event) => {
    console.error(event);
});

export default store;