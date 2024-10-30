export type State = {
    posts: Post[];
    chats: Chat[];
    notifications: Notifi[];
    user: null | User;
};

export type Notifi = {
    id: number;
    type: "error" | "message" | "chat";
    title: string;
    message: string;
    link: string | null;
    showToast: boolean;
    extraData: number | undefined
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

export type Chat = {
    id: number;
    sender: {
        name: string;
        avatar: string;
    };
    receiver: {
        name: string;
        avatar: string;
    };

    created_at: string;
    content: string;
    image_url: string;
    color: string;
};

export type User = {
    id: number;
    username: string;
    nickname: string;
    firstName: string;
    lastName: string;
    email: string;
    image_url: string | null;
    bio: string;
    dob: string;
};

// Define PostResponse type
export type PostResponse = {
    id: number;
    content: string;
    author: User;
    group: GroupResponse;
    created_at: string; // ISO 8601 date string
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
    created_at: string; // ISO 8601 date string
    group_member: number;
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
    Posts: PostResponse[];
    Group: GroupResponse;
    Members: BasicUserResponse[];
};

// Define GroupPageView type
export type ProfilePageView = {
    user: User | null; // null if not logged in
    Posts: PostResponse[];
    LikedPosts: PostResponse[];
    DislikedPosts: PostResponse[];
    Followers: BasicUserResponse[];
};


export type GroupEventResponse = {
    id: number;
    group: GroupResponse;
    creator: User;
    title: string;
    description: string;
    options: EventOptionsResponse[];
    event_time: string; // ISO 8601 string format
    created_at: string; // ISO 8601 string format
};

export type EventOptionsResponse = {
    id: number;
    option: string;
    icon: string;
    count: number;
    users_response: BasicUserResponse[];
    did_user_respond: boolean;
};

export type GroupsHomePageView = {
    User: User | null; // null if not logged in
    Posts: PostResponse[] | null;
    Groups: GroupResponse[];
};
