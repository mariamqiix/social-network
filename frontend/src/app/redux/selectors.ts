import { State } from "../types/Types";

export const selectPosts = (state: State) => state.posts;
export const selectChats = (state: State) => state.chats;
export const selectMessages = (state: State) => state.messages;
export const selectChat = (state: State) => state.selectedChat;
export const selectNotifications = (state: State) => state.notifications;
export const selectUser = (state: State) => state.user;