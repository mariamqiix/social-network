'use client';
import { useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";
import Image from "next/image";
import Card from "../components/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faCalendarDay, faEnvelope, faSignature } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function page() {
    const user = useSelector(selectUser);
    useEffect(() => {
        fetch("http://localhost:8080/user/profile/", { credentials: 'include' }).then((res) => {
            res.text().then((data) => {
                console.log(data);
            });
        });
    }, [fetch]);
    if (user) {
        return <Card title={user.username}>
            <Image
                className="rounded-circle"
                //src={user.image ?? "/placeholder.jpg"}
                src={"/placeholder.jpg"}
                width={80}
                height={80}
                alt="Avatar"
            />
            <h2><FontAwesomeIcon icon={faAt} />{user.username}</h2>
            <h2>{user.firstName} {user.lastName}</h2>
            <p><FontAwesomeIcon icon={faSignature} /> {user.nickname}</p>
            <p><FontAwesomeIcon icon={faCalendarDay} /> {user.dob.split("T")[0]}</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> {user.email}</p>
        </Card>;
    }
    return <h1>You need to login</h1>;
}