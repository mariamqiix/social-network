"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPosts, selectUser } from "../redux/selectors";
import Link from "next/link";
type userLink = {
  id: String;
  username: String;
};
export default function SearchBar() {
  let [isOpen, setIsOpen] = useState(false);
  let [searchTerms, setSearch] = useState("");
  const posts = useSelector(selectPosts);
  const user = useSelector(selectUser);
  const [users, setUsers] = useState<userLink[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/user/list/", {
      credentials: "include",
      method: "POST",
    }).then((response) => {
      response.json().then((json) => {
        let newUsers: userLink[] = [];
        if (json.length > 0) {
          json.forEach((userJson: any) => {
            newUsers.push({
              id: userJson["ID"],
              username: userJson["Username"],
            });
          });
        }
        setUsers(newUsers);
      });
    });
  }, [fetch]);
  return (
    <div className="w-100 p-2">
      <input
        type="text"
        className="form-control"
        name="search"
        placeholder="Search"
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 500);
        }}
        onInput={(e) => setSearch(e.currentTarget.value)}
      />
      <div
        className={
          (isOpen ? "" : "d-none ") +
          "position-fixed z-1 p-3 w-100 text-bg-light"
        }
      >
        {posts
          .filter((item) => item.content.includes(searchTerms))
          .map((item, index) => (
            <p key={index}>
              <Link className="btn btn-link" href={"/posts/" + item.id}>
                post: {item.content}
              </Link>
            </p>
          ))}
        {users
          .filter((item) => item.username.includes(searchTerms))
          .map((u) => (
            <p key={u.id + "-user"}>
              <Link className="btn btn-link" href={"/profile/" + u.id}>
                user: {u.username}
              </Link>
            </p>
          ))}
      </div>
    </div>
  );
}
