import { createStore } from "redux";
import { Post } from "../types/Types";

type State = {
    posts: Post[]
};

const initialState: State = {
    posts: [
        {
            author: {
                name: "Jessy Lincolin",
                avatar: "/placeholder.jpg",
            },
            time: "April 16, 2024",
            content: "Hi everyone, today I was on the most beautiful mountain in the world 🏔, I also want to say hi to Silena, Olya, and Davis!",
            images: ["/placeholder.jpg"],
            likes: 1,
        },
        {
            author: {
                name: "Fatima Mohammed",
                avatar: "/placeholder.jpg",
            },
            time: "April 16, 2024",
            content: "Hello, I just came back from the beautiful Maldives, it was a marvelous trip!",
            images: ["/placeholder.jpg"],
            likes: 1,
        },
        {
            author: {
                name: "Hassan Isa",
                avatar: "/placeholder.jpg",
            },
            time: "April 16, 2024",
            content: "Hello! This is my first post.",
            images: [],
            likes: 1,
        },
        {
            author: {
                name: "Alice Smith",
                avatar: "/placeholder.jpg",
            },
            time: "April 15, 2024",
            content: "Just finished a great book! 📚",
            images: [],
            likes: 5,
        },
    ],
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'posts/add':
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;