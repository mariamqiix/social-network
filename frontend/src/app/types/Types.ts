export type State = {
    posts: Post[];
    notifications: Notifi[];
    user: null | User;
};

export type Notifi = {
    id: number;
    type: "error" | "message" | "chat";
    title: string;
    message: string;
    link: string | null;
};

export type Post = {
    id: number;
    author: {
        name: string;
        avatar: string;
    };
    time: string;
    content: string;
    images: string[];
    likes: number;
};

export type User = {
    id: number;
    username: string;
    nickname: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
    bio: string;
    dob: string;
};

// Define PostResponse type
export type PostResponse = {
    id: number;
    content: string;
    author: User;
    group: GroupResponse;
    creationDate: string; // ISO 8601 date string
    image_url: string;
    likes: ReactionResponse;
    dislikes: ReactionResponse;
};

// Define GroupResponse type
export type GroupResponse = {
    id: number;
    creator: User;
    title: string;
    description: string;
    image_url: string;
    is_user_member: boolean;
    creationDate: string; // ISO 8601 date string
};
export type ReactionResponse = {
    didReact: boolean;
    count: number;
};
// Define BasicUserResponse type
export type BasicUserResponse = {
    id: number;
    username: string;
    nickname: string;
    image_url: string;
};

// Define GroupPageView type
export type GroupPageView = {
    user: User | null; // null if not logged in
    posts: PostResponse[];
    Group: GroupResponse;
    Members: BasicUserResponse[];
};
