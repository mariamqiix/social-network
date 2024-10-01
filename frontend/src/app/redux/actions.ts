import { Notifi, Post, User } from "../types/Types";

export const addPost = (post: Post) => ({
    type: 'posts/add',
    payload: post,
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