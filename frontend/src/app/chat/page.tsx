'use client';
import { useEffect } from "react";
import { selectChats } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "../redux/actions";

export default function page() {
    const chats = useSelector(selectChats);
    const dispatch = useDispatch();
    useEffect(() => {
        fetch("http://localhost:8080/user/userMessages?Username=john_doe", { credentials: 'include' }).then((res) => {
            res.json().then((data) => {
                console.log(data);
                // dispatch(addChat({}))
            });
        });
    }, [fetch]);
    return <div>{chats.length == 0 ? <h1>You have no messages</h1> : <p>{chats.length}</p>}</div>;
}