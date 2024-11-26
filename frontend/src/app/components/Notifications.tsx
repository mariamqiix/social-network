import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { useEffect, useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifications } from "../redux/selectors";
import { getNotification as getNotifications } from "./get_notification";
import { addNotification, removeNotification } from "../redux/actions";

export default function NotificationsBox() {
    let [isOpen, setIsOpen] = useState(false);
    const notifications = useSelector(selectNotifications);
    const dispatch = useDispatch();
    useEffect(() => {
        getNotifications().then(notification => {
            notification.forEach(element => {
                dispatch(addNotification(element));
            });
        });
    }, [getNotifications]);

    return <div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" type="button" onClick={() => {
            setIsOpen(!isOpen);
        }}>
            {isOpen ? <FontAwesomeIcon icon={faClose} /> : <FontAwesomeIcon icon={faBell} />}
            {notifications.length > 0 && (notifications.length)}
        </button>
        <div className={(isOpen ? "" : "d-none ") + " z-1 position-absolute top-0 start-0 bottom-0 end-0"} onClick={() => {
            setIsOpen(false);
        }}>
        </div>
        <div className={(isOpen ? "" : "d-none ") + "position-absolute z-2 w-32 top-20 end-0 me-2 overflow-y-scroll"}>
            <ul className="list-group">
                {notifications.map((notification, index) => (<div key={index} className="list-group-item list-group-item-action" aria-current="true">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{notification.title}</h5>
                        {/* <small>{not.type}</small> */}
                    </div>
                    <p className="mb-1">{notification.message}</p>
                    {notification.function && (<div>
                        <button className="btn btn-primary btn-sm" onClick={() => {
                            if (notification.function) {
                                notification.function(true);
                                dispatch(removeNotification(notification.id));
                            } else {
                                console.error("No function");
                            }
                        }}>Accept</button>
                        <button className="btn btn-danger btn-sm ms-1" onClick={() => {
                            if (notification.function) {
                                notification.function(false);
                                dispatch(removeNotification(notification.id));
                            } else {
                                console.error("No function");
                            }
                        }}>Reject</button>
                    </div>)}
                </div>))}
            </ul>
        </div>
    </div>;
}