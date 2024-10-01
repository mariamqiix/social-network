export type State = {
    posts: Post[]
    notifications: Notifi[]
    user: null | User
};

export type Notifi = {
    id: number,
    type: "error" | "message" | "chat",
    title: string,
    message: string,
    link: string | null,
}

export type Post = {
    id: number,
    author: {
        name: string,
        avatar: string,
    },
    time: string,
    content: string,
    images: string[],
    likes: number,
};

export type User = {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    image: string | null,
    bio: string,
    dob: string,
}