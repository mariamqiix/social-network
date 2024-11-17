'use client';
import { useEffect } from "react";
import { selectChats } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "../redux/actions";
import Metadata from "../components/Metadata";

export default function page() {
    const chats = useSelector(selectChats);
    const dispatch = useDispatch();
    useEffect(() => {
        fetch("http://localhost:8080/user/Chats", { credentials: 'include' }).then((res) => {
            res.text().then((data) => {
                console.log(data);
                // dispatch(addChat({}))
            });
        });
    }, [fetch]);
    return <div>
        <Metadata seoTitle="Friendz | Chat" seoDescription="The next gen social network chat feature" />
        {chats.length == 0 ? <h1>You have no messages</h1> : <p>{chats.length}</p>}
    </div>;
}