'use client';
import { useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";
import "../../../public/profilePage.css";
import Image from "next/image";
import Card from "../components/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faCalendarDay, faEnvelope, faSignature } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

// import React, { useRef, useState, useEffect } from 'react';

import { useState } from "react";


export default function page() {
    const user = useSelector(selectUser);
    useEffect(() => {
        fetch("http://localhost:8080/user/profile/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ user_id: -1 })
        }).then((res) => {
            res.text().then((data) => {
                // console.log(data);
            });
        });
    }, [fetch]);
    if (user) {

        const changeProfileContent = (type: String) => {
            // Function to be executed on button click
            const profileContent = document.getElementById("profileContent");

            // const url = new URL("http://localhost:8080/user/profile/");
            // fetch(url, {
            //     method: "GET",
            // })
            //     .then((response) => {
            //         if (!response.ok) {
            //             //i should handle bad response
            //         }
            //         return response.json();
            //     })
            //     .then((data) => {
            //         if (data && data.Posts) {
            //             displayPostOnProfile(data.Posts, type);
            //         } else {
            //             console.error("Invalid data format. Expected profileView with Posts.");
            //         }
            //     })
            //     .catch((error) => {
            //         console.error("Error fetching profile:", error);
            //     });
        };

        const age = calculateAge(user.dob)
        return (
            <div className="container">
                <div className="userPic" id="userPic" style={{ backgroundImage: `data:image/jpeg;base64,${user.image_url}` }}></div>
                <div className="profileUsername" id="profileUsername">{user.firstName} {user.lastName} ({user.username})</div>
                <div className="userInfo" id="userInfo">
                    <table className="userInfo">
                        <tbody>
                            <tr>
                                <th>Bio: {user.bio}</th>
                            </tr>
                            <tr>
                                <th>Age: {age}</th>
                            </tr>
                            <tr>
                                <th>Email: {user.email}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="userBarDiv">
                    <table className="userBar">
                        <tbody>
                            <tr>
                                <th id="PostsTh" onClick={() => changeProfileContent("Posts")}>
                                    Posts
                                </th>
                                <th id="likesTh" onClick={() => changeProfileContent("Likes")}>
                                    Likes
                                </th>
                                <th id="dislikesTh" onClick={() => changeProfileContent("DisLikes")}>
                                    Dislikes
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div id="profileContent">
                        <p id="selectedColumn">Click on a column to change the content.</p>
                    </div>
                </div>
            </div>);
    }

    return <h1>You need to login</h1>;
}

function calculateAge(birthDateString: string) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the birth date hasn't occurred yet this year, subtract one year from the age.
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function displayPostOnProfile(Posts: any, type: string) {
    if (Array.isArray(Posts)) {
        createPost(Posts, type);
    } else {
        console.error("Invalid data format. Expected an array of posts.");
    }
}

function createPost(Posts: any, caseString: string) {
    const [navigationContent, setNavigationContent] = useState('');

    const clearNavigationContent = () => {
        setNavigationContent('');
    };

    Posts.forEach((post: any) => {

    })
}
