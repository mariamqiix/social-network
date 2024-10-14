import { Notifi, Post, User, Chat } from "../types/Types";

export const addPost = (post: Post) => ({
    type: 'posts/add',
    payload: post,
});

export const addChat = (chat: Chat) => ({
    type: 'chats/add',
    payload: chat,
});

export const addNotification = (notification: Notifi) => ({
    type: 'notifications/add',
    payload: notification,
});

export const login = (user: User) => ({
    type: 'user/login',
    payload: user,
});


export const logout = () => ({
    type: 'user/logout',
});