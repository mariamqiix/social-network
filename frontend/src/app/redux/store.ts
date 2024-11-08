import { createStore } from "redux";
import { Notifi, Post, State, Chat } from "../types/Types";
import { addNotification } from "./actions";
import { useDispatch } from "react-redux";

const initialState: State = {
    posts: [],
    chats: [],
    notifications: [],
    user: null,
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'posts/add':
            if (state.posts.some((post: Post) => post.id == action.payload.id)) {
                for (let i = 0; i < state.posts.length; i++) {
                    if (state.posts[i].id == action.payload.id) {
                        // console.log("update post: ", i);
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
                for (let i = 0; i < state.posts.length; i++) {
                    if (state.chats[i].id == action.payload.id) {
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
        case 'notifications/add':
            if (state.notifications.some((not: Notifi) => not.id == action.payload.id)) {
                for (let i = 0; i < state.posts.length; i++) {
                    if (state.notifications[i].id == action.payload.id) {
                        // console.log("update post: ", i);
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
            return {
                ...state,
                user: null,
            }
        default:
            return state;
    }
}

const store = createStore(reducer);

const socket = new WebSocket('ws://localhost:8080/socket');
console.log("socket created: ", socket);
socket.onmessage = (event) => {
    // setMessages((prevMessages) => [...prevMessages, event.data]);
    console.log("socket received: ", event.data);
    try {
        let data = JSON.parse(event.data);
        console.log(data);
        if (data.message_type == "Notification") {
            store.dispatch(addNotification({ id: data.notification.id, type: "message", title: data.notification.type, message: data.notification.message, link: "", showToast: true, extraData: data.notification.group_id }));
        }
    } catch (error) {
        console.error(error);
    }
};

export default store;