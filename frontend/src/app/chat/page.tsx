'use client';
import { useEffect, useState } from "react";
import { selectChat, selectChats, selectMessages, selectUser } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { addChat, addMessage, SelectChat } from "../redux/actions";
import Metadata from "../components/Metadata";
import { Chat, ChatMessage } from "../types/Types";
import { socket } from "../redux/store";

export default function page() {
    const user = useSelector(selectUser);
    const chats = useSelector(selectChats);
    const messages = useSelector(selectMessages);
    const selectedChat = useSelector(selectChat);
    const dispatch = useDispatch();
    let [imageData, setImageData] = useState("");
    const [isImageSelected, setIsImageSelected] = useState(false); // New state to track image selection

    function loadImage() {
        let form = document.querySelector("form");
        if (form && form.children[1].files) {
            let reader = new FileReader();
            reader.onload = function (e) {
                setImageData((e.target?.result as string));
                setIsImageSelected(true); // Set to true when an image is selected
            }
            reader.readAsDataURL(form.children[1].files[0]);
        }
    }
    function selectImage() {
        setImageData(""); // Clear the image data
        setIsImageSelected(false); // Set to false when the image is deselected
        let form = document.querySelector("form");
        if (form && form.children[1]) {
            form.children[1].value = ""; // Clear the file input
            form.children[1].click();
        }
    }

    function renderChatList(newChats: Chat[]) {
        return newChats.map((chat: Chat) => (<button key={chat.id + chat.type} className={"list-group-item list-group-item-action" + (selectedChat?.name == chat.name && selectedChat?.type == chat.type ? " active" : "")} onClick={() => {
            // setSelectedChat(chat);
            LoadMessages(chat);
        }}>{chat.name}</button>));
    }

    async function LoadMessages(chat: Chat) {
        dispatch(SelectChat(chat));
        if (chat.type == "user") {
            fetch("http://localhost:8080/user/Chats?Username=" + chat.name, { credentials: 'include' }).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        // console.log(data);
                        if (data.Messages) {
                            data.Messages.map((ma: any) => ({ id: ma.id, sender: { name: ma.Sender.username, avatar: "data:image/jpeg;base64," + ma.Sender.image_url }, created_at: ma.created_at, content: ma.content, image_url: "data:image/jpeg;base64," + ma.image_url, type: "user", group_name: null })).forEach((message: ChatMessage) => {
                                dispatch(addMessage(message));
                            });
                        }
                    });
                }
            });
        } else {
            fetch("http://localhost:8080/group/messages?id=" + chat.id, { credentials: 'include' }).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        // console.log(data);
                        data.map((da: any) => ({ id: da.id, sender: { name: da.Sender.username, avatar: "data:image/jpeg;base64," + da.Sender.image_url }, created_at: da.created_at, content: da.content, image_url: "data:image/jpeg;base64," + da.image_url, type: "group", group_name: chat.id })).forEach((message: ChatMessage) => {
                            dispatch(addMessage(message));
                        });;
                    });
                }
            });
        }
    }

    function renderChatWindow() {
        setTimeout(() => {
            let scroll = document.getElementById('messages')!;
            scroll.scrollTop = scroll.scrollHeight;
            scroll.animate({ scrollTop: scroll.scrollHeight });
        }, 200);
        return <div id="messages" className="flex flex-fill flex-column overflow-y-scroll">
            {messages.toReversed().map((message: ChatMessage) =>
                <div className={"border rounded-3 m-2 p-2 w-50 " + (user?.username == message.sender.name ? "border-primary text-end ms-auto d-flex flex-row-reverse" : "border-secondary")} key={"message" + message.id + message.created_at + message.content}>
                    <img className="rounded-circle mx-2" width={24} height={24} src={message.sender.avatar}></img>
                    <span>
                        {message.sender.name}
                        <br />
                        {message.created_at.replace("T", " ").replace("Z", "").split("+")[0].split(".")[0]}
                        <br />
                        {message.content}
                        <br />
                        {message.image_url != "" && message.image_url != "data:image/jpeg;base64," && (<img src={message.image_url} className="w-100" />)}
                    </span>
                </div>
            )}
        </div>;
    }

    useEffect(() => {
        fetch("http://localhost:8080/user/usersAbleToChat", { credentials: 'include' }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    // console.log(data);
                    data.forEach((element: any) => {
                        // console.log(element);
                        dispatch(addChat({ id: element.id, name: element.username, avatar: "data:image/jpeg;base64," + element.image_url, type: "user" }));
                    });
                });
            }
        });
        fetch("http://localhost:8080/group/list/joined", { credentials: 'include' }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data);
                    data.Groups.forEach((group: any) => {
                        // console.log(group);
                        dispatch(addChat({ id: group.id, name: group.title, avatar: "data:image/jpeg;base64," + group.image_url, type: "group" }));
                    });
                });
            }
        });
    }, [fetch]);
    return <div>
        <Metadata seoTitle="Friendz | Chat" seoDescription="The next gen social network chat feature" />
        {chats.length > 0 ?
            (<div className="d-flex flex-row" style={{ height: "94vh" }}>
                <div>
                    <h3>Groups</h3><br />
                    <div className="list-group">
                        {renderChatList(chats.filter(chat => chat.type == "group"))}
                    </div>
                    <br />
                    <h3>Users</h3>
                    <div className="list-group">
                        {renderChatList(chats.filter(chat => chat.type == "user"))}
                    </div>
                </div>
                <div className="border-start ms-2 d-flex flex-column w-100 justify-content-stretch">
                    {renderChatWindow()}
                    <form className="input-group w-full ps-2 position-sticky bottom-0" onSubmit={(e) => {
                        e.preventDefault();
                        let formData = new FormData(e.target as HTMLFormElement);
                        if (selectedChat != null && formData.get("message")) {
                            let message: string = formData.get("message")?.toString() ?? "";
                            let receiverUsername = selectedChat.name;
                            socket.send(JSON.stringify({ message: message, type: selectedChat.type == "group" ? "GroupMessage" : "User message", sender_username: user?.username, receiver_id: receiverUsername, group_id: selectedChat?.id, image: imageData != "" ? imageData.substring(imageData.indexOf(",") + 1) : null }));
                            if (selectedChat.type == "user") {
                                dispatch(addMessage({ id: 0, content: message, created_at: (new Date()).toISOString(), image_url: imageData, sender: { name: user?.username ?? "", avatar: user?.image_url ?? "" }, type: selectedChat.type, group_name: (selectedChat.type == "group" ? selectedChat.id : null) }));
                            }
                            setImageData("");
                            e.target.reset();
                        }
                    }}>
                        <input type="text" name="message" className="form-control" />
                        <input type="file" className="d-none" id="inputFile" aria-describedby="inputGroupFileAddon03" aria-label="Upload" onChange={() => {
                            loadImage();
                        }} />
                        <button className="btn btn-outline-secondary" type="button">
                            <img src={imageData} height={30} width={40} alt="Image" onClick={() => {
                                selectImage();
                            }} />
                        </button>
                        <button type="submit" className="btn btn-outline-secondary text-bg-primary">Send</button>
                    </form>
                </div>
            </div>)
            : <p>No chats available</p>}
    </div>;
}