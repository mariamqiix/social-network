import { createStore } from "redux";
import { Notifi, Post, State, Chat } from "../types/Types";

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
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
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
socket.onmessage = (event) => {
    // setMessages((prevMessages) => [...prevMessages, event.data]);
    console.log("socket received: ", event.data);
};

export default store;