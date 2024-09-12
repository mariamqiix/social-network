'use client';

import { useState } from "react";
const items = ["hello", "test", "results", "hasan"];

export default function SearchBar() {
    let [isOpen, setIsOpen] = useState(false);
    let [searchTerms, setSearch] = useState("");
    return <div className="w-100 p-2">
        <input type="text" className="form-control" name="search" placeholder="Search" onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)} onInput={(e) => setSearch(e.currentTarget.value)} />
        <div className={(isOpen ? "" : "d-none ") + "position-fixed z-1 p-3 w-100 text-bg-light"}>
            {items.filter((item => item.includes(searchTerms))).map((item,index) => <p key={index}>{item}</p>)}
        </div>
    </div>;
}