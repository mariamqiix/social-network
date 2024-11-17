'use client';
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/card";
import { colors } from "../components/colors";
import { selectNotifications } from "../redux/selectors";
import { type Notifi } from "../types/Types";
import { useEffect } from "react";
import { addNotification } from "../redux/actions";


import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

const notificationColors = {
    "error": colors[3],
    "message": colors[2],
    "chat": colors[1],
    "GroupRequestToJoin": colors[4],
    "GroupInvite": colors[0],
    "GroupInviteAccept": colors[6],
    "GroupRequestReject": colors[6],
};

const notificationIcons = {
    "error": <FontAwesomeIcon className="me-2" icon={faExclamation} />,
    "message": <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="black"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="me-2"
        style={{ width: "16px" }}
    >
        <path
            fillRule="evenodd"
            d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
            clipRule="evenodd"
        />
    </svg>,
    "chat": <div></div>,
    "GroupRequestToJoin": <FontAwesomeIcon icon={faPeopleGroup} />,
    "GroupInvite": <FontAwesomeIcon icon={faPeopleGroup} />,
    "GroupInviteAccept": <FontAwesomeIcon icon={faPeopleGroup} />,
    "GroupRequestReject": <FontAwesomeIcon icon={faPeopleGroup} />,
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
                        console.log(data);
                        data.forEach((element: any) => {
                            dispatch(addNotification({
                                id: element.id,
                                type: element.type,
                                title: element.type,
                                message: element.message,
                                link: "",
                                showToast: false,
                                function: element.type == "GroupInvite" ? () => {
                                    fetch("http://localhost:8080/user/responds/groupInviteResponse", { method: "POST", credentials: 'include', body: JSON.stringify({ group_id: element.group_id, response: "Accept" }) }).then((res) => {
                                        console.log(res.status);
                                        res.text().then((data) => {
                                            console.log(data);
                                        });
                                    });
                                } : element.type == "GroupRequestToJoin" ? () => {
                                    fetch("http://localhost:8080/user/responds/adminGroupRequestResponse", { method: "POST", credentials: 'include', body: JSON.stringify({ group_id: element.group_id, user_id: element.sender_id, response: "Accept" }) }).then((res) => {
                                        console.log(res.status);
                                        res.text().then((data) => {
                                            console.log(data);
                                        });
                                    });
                                } : element.type == "followRequest" ? () => {
                                    fetch("http://localhost:8080/user/responds/followResponse", { method: "POST", credentials: 'include', body: JSON.stringify({ user_id: element.sender_id, response: "Accept" }) }).then((res) => {
                                        console.log(res.status);
                                        res.text().then((data) => {
                                            console.log(data);
                                        });
                                    });
                                } : null,
                            }));
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
            <p>{notificationIcons[notification.type]} {notification.message}</p>
            {notification.function != null ? <button className="btn btn-primary" onClick={() => {
                if (notification.function != null) {
                    notification.function();
                }
            }}>Accept</button> : <div></div>}
        </Card>);
    } else {
        return <p>You have no notifications</p>
    }
}