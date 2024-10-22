'use client';

import { useState } from "react";
import { useSelector } from "react-redux";
import { selectPosts } from "../redux/selectors";
import Link from "next/link";
const pages = ["profile", "chats", "groups", "posts", "notifications"];

export default function SearchBar() {
    let [isOpen, setIsOpen] = useState(false);
    let [searchTerms, setSearch] = useState("");
    const posts = useSelector(selectPosts);
    return <div className="w-100 p-2">
        <input type="text" className="form-control" name="search" placeholder="Search" onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)} onInput={(e) => setSearch(e.currentTarget.value)} />
        <div className={(isOpen ? "" : "d-none ") + "position-fixed z-1 p-3 w-100 text-bg-light"}>
            {pages.filter((item => item.includes(searchTerms))).map((item, index) => <p key={index}><Link href={"/" + item}>{item}</Link></p>)}
            {posts.filter((item => item.content.includes(searchTerms))).map((item, index) => <p key={index}><Link href={"/posts/" + item.id}>{item.content}</Link></p>)}
        </div>
    </div>;
}