'use client';
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/card";
import { colors } from "../components/colors";
import { selectNotifications } from "../redux/selectors";
import { type Notifi } from "../types/Types";
import { useEffect } from "react";
import { addNotification } from "../redux/actions";

const notificationColors = {
    "error": colors[3],
    "message": colors[0],
    "chat": colors[1],
};

export default function page() {
    const notifications = useSelector(selectNotifications);
    const dispatch = useDispatch();
    useEffect(() => {
        fetch("http://localhost:8080/user/notifications/", { credentials: 'include' }).then((res) => {
            res.text().then((data) => {
                console.log(data);
                // dispatch(addNotification({}));
            });
        });
    }, [fetch]);
    return notifications.map(notification => <Card key={notification.id} title={notification.title} color={notificationColors[notification.type]}>
        <p>{notification.message}</p>
    </Card>);
}