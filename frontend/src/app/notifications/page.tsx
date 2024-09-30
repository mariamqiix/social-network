'use client';
import { useSelector } from "react-redux";
import Card from "../components/card";
import { colors } from "../components/colors";
import { selectNotifications } from "../redux/selectors";
import { type Notifi } from "../types/Types";

const notificationColors = {
    "error": colors[3],
    "message": colors[0],
    "chat": colors[1],
};

export default function page() {
    const notifications = useSelector(selectNotifications);
    return notifications.map(notification => <Card key={notification.id} title={notification.title} color={notificationColors[notification.type]}>
        <p>{notification.message}</p>
    </Card>);
}