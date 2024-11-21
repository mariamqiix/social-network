'use client';

import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifications } from "../redux/selectors";
import { hideToastNotification } from "../redux/actions";
import Link from "next/link";

const toastIcons = {
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
    "chat": <div></div>
};

let id: number = 0;

export default function Toasts() {
    const notifications = useSelector(selectNotifications);
    const dispatch = useDispatch();

    return <div className="toast-container position-fixed m-2 top-0 end-0">
        {notifications.filter((not) => not.showToast).map((not) => <div key={not.id} className={not.type == "error" ? "toast show text-bg-danger" : "toast show"} role="alert" aria-live="assertive" aria-atomic="true">
            <Link href="/notifications">
                <div className="toast-header">
                    {/* <img src="..." className="rounded me-2" alt="..." /> */}
                    {toastIcons[not.type]}
                    <strong className="me-auto">{not.title}</strong>
                    <small className="text-body-secondary">just now</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => {
                        dispatch(hideToastNotification(not.id));
                    }}></button>
                </div>
                <div className="toast-body">
                    {not.message}
                </div>
            </Link>
        </div>)}
    </div>;
}