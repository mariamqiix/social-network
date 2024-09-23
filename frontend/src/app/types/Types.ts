export type Notifi = {
    id: number,
    type: "error" | "message" | "chat",
    title: string,
    message: string,
}