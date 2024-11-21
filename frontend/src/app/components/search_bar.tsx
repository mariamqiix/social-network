'use client';

import { useState } from "react";
import { useSelector } from "react-redux";
import { selectPosts, selectUser } from "../redux/selectors";
import Link from "next/link";

export default function SearchBar() {
    let [isOpen, setIsOpen] = useState(false);
    let [searchTerms, setSearch] = useState("");
    const posts = useSelector(selectPosts);
    const user = useSelector(selectUser);
    const pages = ["chat", "groups", "posts", "notifications"];
    return <div className="w-100 p-2">
        <input type="text" className="form-control" name="search" placeholder="Search" onFocus={() => setIsOpen(true)} onBlur={() => {
            setTimeout(() =>
                setIsOpen(false), 100);
        }} onInput={(e) => setSearch(e.currentTarget.value)} />
        <div className={(isOpen ? "" : "d-none ") + "position-fixed z-1 p-3 w-100 text-bg-light"}>
            {[...pages.filter((item => item.includes(searchTerms))), ...(user ? ["profile/" + user.id] : [])].map((item, index) => <p key={index}><Link className="btn btn-link" href={"/" + (item == "posts" ? "" : item)}>{item}</Link></p>)}
            {posts.filter((item => item.content.includes(searchTerms))).map((item, index) => <p key={index}><Link className="btn btn-link" href={"/posts/" + item.id}>{item.content}</Link></p>)}
        </div>
    </div>;
}