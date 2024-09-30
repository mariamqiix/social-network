import { Notifi, Post } from "../types/Types";

export const addPost = (post: Post) => ({
    type: 'posts/add',
    payload: post,
});

export const addNotification = (notification: Notifi) => ({
    type: 'notifications/add',
    payload: notification,
});