import Card from "../components/card";
import { colors } from "../components/colors";
import { type Notifi } from "../types/Types";

let notifications: Notifi[] = [
    {
        id: 1,
        type: "message",
        title: "new post",
        message: "I am the museum today",
    },
    {
        id: 2,
        type: "chat",
        title: "chat message",
        message: "let's meet over the weekend",
    },
    {
        id: 3,
        type: "chat",
        title: "chat message",
        message: "how are you doing?",
    },
];

const notificationColors = {
    "error": colors[3],
    "message": colors[0],
    "chat": colors[1],
};

export default function page() {
    return notifications.map(notification => <Card key={notification.id} title={notification.title} color={notificationColors[notification.type]}>
        <p>{notification.message}</p>
    </Card>);
}