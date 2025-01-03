import { Notifi, Post, User, ChatMessage, Chat } from "../types/Types";

export const addPost = (post: Post) => ({
    type: 'posts/add',
    payload: post,
});

export const likePost = (id: Number, value: Number) => ({
    type: 'posts/like',
    payload: { id, value },
});

export const addChat = (chat: Chat) => ({
    type: 'chats/add',
    payload: chat,
});

export const addMessage = (message: ChatMessage) => ({
    type: 'message/add',
    payload: message,
});

export const SelectChat = (chat: Chat) => ({
    type: 'chat/select',
    payload: chat,
});

export const addNotification = (notification: Notifi) => ({
    type: 'notifications/add',
    payload: notification,
});

export const removeNotification = (id: number) => ({
    type: 'notifications/remove',
    payload: id,
});

export const hideToastNotification = (id: number) => ({
    type: 'notifications/hideToast',
    payload: id,
});

export const login = (user: User) => ({
    type: 'user/login',
    payload: user,
});


export const logout = () => ({
    type: 'user/logout',
});