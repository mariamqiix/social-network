"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { selectNotifications, selectUser } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/actions";
import { useEffect } from "react";

const links = ["/", "/chat", "/groups", "/profile", "/notifications", "/login"];

const icons = [
    <path
        fillRule="evenodd"
        d="M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z"
        clipRule="evenodd"
    />,
    <path
        fillRule="evenodd"
        d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
        clipRule="evenodd"
    />,
    <path
        fillRule="evenodd"
        d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
        clipRule="evenodd"
    />,
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />,
    <path
        fillRule="evenodd"
        d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
        clipRule="evenodd"
    />,
    <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
        clipRule="evenodd"
    />,
];

export default function Nav() {
    const user = useSelector(selectUser);
    const notifications = useSelector(selectNotifications);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch("http://localhost:8080/login",
            { method: "POST", credentials: 'include' }).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        dispatch(login({ id: data.ID, username: data.Username, firstName: data.FirstName, lastName: data.LastName, email: data.Email, image: data.ImageID, dob: data.DateOfBirth, bio: data.Bio }));
                    });
                }
            });
    }, [dispatch]);

    const router = useRouter()
    function logoutButton() {
        if (user != null) {
            fetch("http://localhost:8080/logout",
                { method: "POST", credentials: 'include' }).then(res => {
                    console.log(res.status);
                    res.text().then(data => {
                        console.log(data);
                    });
                    if (res.ok) {
                        dispatch(logout());
                        router.replace("/login");
                    }
                });
        }
    }

    const pathName = usePathname();
    return (
        <nav className="h-sm-100 w-auto">
            <ul className="nav d-flex flex-sm-column flex-row p-sm-5 justify-content-center position-sm-sticky bottom-0 p-2">
                {user != null ?
                    <div className="container-fluid d-flex flex-column align-items-center">
                        <a className="navbar-brand m-0 p-0" href="#">
                            <Image
                                className="rounded-circle"
                                src={user.image_url ?? "/placeholder.jpg"}
                                width={80}
                                height={80}
                                alt="Avatar"
                            />
                        </a>
                        <span className="d-none d-sm-block">
                            <br />
                            {user.firstName} {user.lastName}
                            <br />
                            <span className="text-body-tertiary">{user.username}</span>
                        </span>
                    </div> : <p>Not logged in</p>}
                {links.map((link, i) => link != "/login" || user == null ? (
                    <Link
                        href={link}
                        key={link}
                        className={
                            (pathName == link || (pathName == "" && link == "/") ? "btn-dark" : "") +
                            " btn nav-item rounded-4 m-1 d-flex align-items-center"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={pathName == link || (pathName == "" && link == "/") ? "white" : "black"}
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            // stroke="currentColor"
                            className="icon"
                        >
                            {icons[i]}
                        </svg>
                        <span
                            className={
                                (pathName == link || (pathName == "" && link == "/") ? "text-white" : "text-black") +
                                " text-start nav-link d-none d-sm-block"
                            }
                        >
                            {link == "/" ? "Posts" : link[1].toLocaleUpperCase() + link.slice(2)}
                        </span>
                        {link == "/notifications" ? notifications.length : ""}
                    </Link>
                ) : (<div key={link}></div>))}
                {user ?
                    <div
                        className={
                            "btn nav-item rounded-4 m-1 d-flex align-items-center"
                        }
                        onClick={() => {
                            logoutButton();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="black"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            // stroke="currentColor"
                            className="icon"
                        >
                            <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
                        </svg>
                        <span
                            className={
                                "text-black text-start nav-link d-none d-sm-block"
                            }
                        >
                            Logout
                        </span>
                    </div> : <div></div>}
            </ul>
        </nav>
    );
}
