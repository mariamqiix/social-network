import { State } from "../types/Types";

export const selectPosts = (state: State) => state.posts;
export const selectChats = (state: State) => state.chats;
export const selectNotifications = (state: State) => state.notifications;
export const selectUser = (state: State) => state.user;