'use client';
import { useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";
import Image from "next/image";
import Card from "../components/card";

export default function page() {
    const user = useSelector(selectUser);
    if (user) {
        return <Card title="Profile">
            <h2>@{user.username}</h2>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.dob}</p>
            <p>{user.email}</p>
            <Image
                className="rounded-circle"
                src={user.image ?? "/placeholder.jpg"}
                width={80}
                height={80}
                alt="Avatar"
            />
        </Card>;
    }
    return <h1>You need to login</h1>;
}