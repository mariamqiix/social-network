"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { selectUser } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/actions";
import { ReactElement, useEffect } from "react";
import { GetUserImage } from "./user_image";

type MenuItem = {
    href: string;
    title: string;
    icon: ReactElement;
};

export default function Nav() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    let items: MenuItem[] = [
        {
            href: "/",
            title: "Posts",
            icon: <path
                fillRule="evenodd"
                d="M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z"
                clipRule="evenodd"
            />
        },
        {
            href: user ? "/chat" : "#",
            title: "Chat",
            icon: <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                clipRule="evenodd"
            />
        },
        {
            href: "/groups",
            title: "Groups",
            icon: <path
                fillRule="evenodd"
                d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                clipRule="evenodd"
            />
        },
        {
            href: user ? "/profile/" + user.id : "#",
            title: "Profile",
            icon: <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
        },
        {
            href: "/login",
            title: user ? "Logout" : "Login",
            icon: user ? <path
                d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z"
            /> : <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clipRule="evenodd"
            />
        }
    ];
    useEffect(() => {
        fetch("http://localhost:8080/login",
            { method: "POST", credentials: 'include' }).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        GetUserImage(data.ID).then((img) => {
                            dispatch(login({ id: data.ID, username: data.Username, nickname: data.Nickname, first_name: data.FirstName, last_name: data.LastName, email: data.Email, image_url: img, dob: data.DateOfBirth, bio: data.Bio }));
                        })
                    });
                }
            });
    }, [dispatch]);

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
                    }
                });
        }
    }

    const pathName = usePathname();
    return (
        <nav className="h-sm-100 w-auto">
            <ul className="nav d-flex flex-sm-column flex-row p-sm-5 justify-content-center position-sm-sticky bottom-0 p-2">
                <Image
                    src={"/LOGO.png"}
                    width={200}
                    height={80}
                    alt="Logo"
                    priority={true}
                />
                {user != null ?
                    <div className="container-fluid d-flex flex-column align-items-center mb-4ƒ">
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
                            {user.first_name} {user.last_name}
                            <br />
                            <span className="text-body-tertiary">{user.username}</span>
                        </span>
                    </div> : <p>Not logged in</p>}
                {items.map((item, index) => (
                    <Link
                        href={item.href}
                        key={item.href + "-" + index}
                        className={
                            (pathName == item.href ? "btn-dark text-bg-dark" : "") +
                            " btn nav-item rounded-4 m-1 d-flex align-items-center"
                        }
                        onClick={() => {
                            if (user && item.href == "/login") {
                                logoutButton();
                            } else if (!user && item.href == "#") {
                                alert("not logged in");
                            }
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={pathName == item.href ? "white" : "black"}
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            className="icon"
                        >
                            {item.icon}
                        </svg>
                        <span className="text-start text-reset nav-link d-none d-sm-block">
                            {item.title}
                        </span>
                    </Link>
                ))}
            </ul>
        </nav>
    );
}
