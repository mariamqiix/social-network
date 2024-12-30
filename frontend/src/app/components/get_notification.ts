import { Notifi } from "../types/Types";

export function addNotificationFunction(notification: any): Function | null {
    return notification.type == "GroupInvite" ? (isAccept: boolean) => {
        fetch("http://localhost:8080/user/responds/groupInviteResponse?id=" + notification.id, { method: "POST", credentials: 'include', body: JSON.stringify({ group_id: notification.group_id, response: isAccept ? "Accept" : "Reject" }) }).then((res) => {
            console.log(res.status);
            res.text().then((data) => {
                console.log(data);
            });
        });
    } : notification.type == "GroupRequestToJoin" ? (isAccept: boolean) => {
        fetch("http://localhost:8080/user/responds/adminGroupRequestResponse?id=" + notification.id, { method: "POST", credentials: 'include', body: JSON.stringify({ group_id: notification.group_id, user_id: notification.sender_id, response: isAccept ? "Accept" : "Reject" }) }).then((res) => {
            console.log(res.status);
            res.text().then((data) => {
                console.log(data);
            });
        });
    } : notification.type == "followRequest" ? (isAccept: boolean) => {
        fetch("http://localhost:8080/user/responds/followResponse?id=" + notification.id, { method: "POST", credentials: 'include', body: JSON.stringify({ user_id: notification.sender_id, response: isAccept ? "Accept" : "Reject" }) }).then((res) => {
            console.log(res.status);
            res.text().then((data) => {
                console.log(data);
            });
        });
    } : null
}


export async function getNotification(): Promise<Notifi[]> {
    let notifications: Notifi[] = [];
    await fetch("http://localhost:8080/user/notifications/", { credentials: 'include' }).then(async (res) => {
        if (res.status == 200) {

            await res.json().then((data) => {
                // console.log(data);
                if (data) {
                    // console.log(data);
                    data.forEach((element: any) => {
                        notifications.push({
                            id: element.id,
                            type: element.type,
                            title: element.type,
                            message: element.message,
                            link: "",
                            showToast: false,
                            function: addNotificationFunction(element),
                        });
                    });
                }
            });
        } else {
            res.text().then(text => {
                if (text!="Unauthorized"){console.error(text);}
            })
        }
    });
    return notifications;
}