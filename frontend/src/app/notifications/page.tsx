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
            if (res.status == 200) {

                res.json().then((data) => {
                    console.log(data);
                    if (data) {
                        data.forEach((element: any) => {
                            dispatch(addNotification({ id: element.id, type: "message", title: element.type, message: element.message, link: "", showToast: false, extraData: element.group_id }));
                        });
                    }
                });
            } else {
                res.text().then(text => {
                    console.error(text);
                })
            }
        });
    }, [fetch]);

    if (notifications.length > 0) {
        return notifications.map(notification => <Card key={notification.id} title={notification.title} color={notificationColors[notification.type]}>
            <p>{notification.message}</p>
            {notification.title == "GroupInvite" ? <button className="btn btn-primary" onClick={() => {
                fetch("http://localhost:8080/user/responds/groupInviteResponse", { method: "POST", credentials: 'include', body: JSON.stringify({ group_id: notification.extraData, response: "Accept" }) }).then((res) => {
                    console.log(res.status);
                    res.text().then((data) => {
                        console.log(data);
                    });
                });
            }}>Accept</button> : <div></div>}
        </Card>);
    } else {
        return <p>You have no notifications</p>
    }
}