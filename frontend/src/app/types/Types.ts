export type Notifi = {
    id: number,
    type: "error" | "message" | "chat",
    title: string,
    message: string,
}

export type Post = {
    author: {
        name: string,
        avatar: string,
    },
    time: string,
    content: string,
    images: string[],
    likes: number,
};