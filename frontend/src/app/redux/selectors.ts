import { State } from "../types/Types";

export const selectPosts = (state: State) => state.posts;
export const selectNotifications = (state: State) => state.notifications;