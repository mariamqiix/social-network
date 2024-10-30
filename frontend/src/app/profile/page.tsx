'use client';
import { useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";
import "../../../public/profilePage.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faCalendarDay, faEnvelope, faSignature } from "@fortawesome/free-solid-svg-icons";
import { ProfilePageView } from "../types/Types";
import { useEffect } from "react";
import { fetchProfileData} from "./fetch";


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

        const age = calculateAge(user.dob);

        const [isMember, setIsMember] = useState(true);
        const [activeTab, setActiveTab] = useState('Posts');

        const [profileData, setProfileData] = useState<ProfilePageView>({
            user: null,
            Posts: [],
            LikedPosts: [],
            DislikedPosts: [],
            Followers: []
        });

        const handleTabClick = (tabName: string) => {
            switch (tabName) {
                case 'Posts':
                    setIsMember(false);  // Update the membership status
                    setActiveTab('Posts');
    
                    useEffect(() => {
                        const getData = async () => {
                            const data = await fetchProfileData();
                            console.log(data);
                            // if (data.Group.is_user_member) {
                            //     setIsMember(true)
                            // }
                            setProfileData(data);
                        };
    
                        getData();
                    }, []);
        
    
                    // send a request to leave the group
                    break;
                case 'LikedPosts':
                    setActiveTab('Posts');
                    // RequestToJoin();
                    // send a request to join the group
                    break;
                case 'DisLikedPosts':
                        setActiveTab('Posts');
                        // RequestToJoin();
                        // send a request to join the group
                        break;
                default:
                    setActiveTab(tabName);
            }
        };

        return (
            <div className="Container">

            {/* Profile Header */}
            <div className="ProfilePageHeader">
                <div className="profile-info">
                    <img
                        src={`data:image/jpeg;base64,${user.image_url}`}
                        alt="Avatar"
                        className="profile-avatar"
                    />

                        <div className="profile-details">
                            <h1 className="profile-name">{user.firstName} {user.lastName} ({user.username})</h1>
                            <p className="profile-desc">{user.bio}</p>
                            <div className="profile-follow-info">
                                {profileData.Followers &&
                                    <span>{profileData.Followers ? profileData.Followers.length : 0} Member</span>
                                }
                            </div>
                        </div>
                </div>

                {profileData && isMember && (
                    <div className="button-container">
                        <button className="expandable-button button-1" onClick={() => setIsPostPopupOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon" style={{ color: '#f35366' }} />
                            <span>UnFollow</span>
                        </button>

                    </div>)
                }
            </div>


            {/* Navigation Bar */}
            <div className="list-bar">
                <ul>
                    <li
                        className={activeTab === 'Posts' ? 'active' : ''}
                        onClick={() => handleTabClick('Posts')}
                    >
                        Posts
                    </li>
                    <li
                        className={activeTab === 'Events' ? 'active' : ''}
                        onClick={() => handleTabClick('LikedPosts')}
                    >
                        LikedPosts
                    </li>

                    <li
                        className={activeTab === 'Members' ? 'active' : ''}
                        onClick={() => handleTabClick('DisLikedPosts')}
                    >
                        DisLikedPosts
                    </li>
                    <li onClick={() => handleTabClick(isMember ? 'Leave' : 'Join')}>
                        {isMember ? 'Leave' : 'Join'}
                    </li>
                </ul>
            </div>



            {/* Main Content Area */}
            <div className="content-area">
                {activeTab === 'Events' && profileData.Group && profileData.Group.is_user_member && groupEvent && (
                    <div className="events-section">
                        <div className="profileGroup-container">
                            {groupEvent.map((group) => (
                                <div className="profileGroup">
                                    <img src={`data:image/jpeg;base64,${profileData.Group.image_url}`} alt={profileData.Group.image_url} className="group-image" />

                                    <div className="group-details">
                                        <div className="event-icons">
                                            {group.options && group.options.map((option, index) => (
                                                <span
                                                    key={index}
                                                    className={`iconEvent`} // Optionally add unique class based on ID
                                                    style={getIconStyle(option.did_user_respond)} // Apply styles based on response
                                                    onClick={() => {
                                                        const hasResponded = group.options.some(option => option.did_user_respond);
                                                        if (!hasResponded) {
                                                            handleReact(option.id, group.id);
                                                        }
                                                    }}                                     >
                                                    {getIconComponent(option.icon)} {/* Render icon */}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="group-date"><i className="icon-calendar"></i> {group.created_at}</p>
                                        <h3 className="eventTitle">{group.title}</h3>
                                        <p className="group-location">{group.description
                                        }</p>

                                        {/* Display images of friends, showing only the first three and a + if there are more */}
                                        <p className="group-friends">
                                            {group.options && group.options[0] && group.options[0].users_response && (
                                                <>
                                                    <i className="icon-friends"></i>
                                                    {group.options[0].users_response.slice(0, 3).map((friend, index) => (
                                                        <img
                                                            key={index}
                                                            src={`data:image/jpeg;base64,${friend.image_url}`}
                                                            alt={`Friend ${index + 1}`}
                                                            className="friend-image"
                                                        />
                                                    ))}
                                                    {group.options[0].users_response.length > 3 ? (
                                                        <span className="friendsText">+ {group.options[0].users_response.length - 3} friends are going</span>
                                                    ) : (
                                                        <span className="friendsText">{group.options[0].users_response.length} friends are going</span>
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            
            // <div className="container">
            //     <div className="userPic" id="userPic" style={{ backgroundImage: `data:image/jpeg;base64,${user.image_url}` }}></div>
            //     <div className="profileUsername" id="profileUsername">{user.firstName} {user.lastName} ({user.username})</div>
            //     <div className="userInfo" id="userInfo">
            //         <table className="userInfo">
            //             <tbody>
            //                 <tr>
            //                     <th>Bio: {user.bio}</th>
            //                 </tr>
            //                 <tr>
            //                     <th>Age: {age}</th>
            //                 </tr>
            //                 <tr>
            //                     <th>Email: {user.email}</th>
            //                 </tr>
            //             </tbody>
            //         </table>
            //     </div>
            //     <div className="userBarDiv">
            //         <table className="userBar">
            //             <tbody>
            //                 <tr>
            //                     <th id="PostsTh" onClick={() => changeProfileContent("Posts")}>
            //                         Posts
            //                     </th>
            //                     <th id="likesTh" onClick={() => changeProfileContent("Likes")}>
            //                         Likes
            //                     </th>
            //                     <th id="dislikesTh" onClick={() => changeProfileContent("DisLikes")}>
            //                         Dislikes
            //                     </th>
            //                 </tr>
            //             </tbody>
            //         </table>
            //         <div id="profileContent">
            //             <p id="selectedColumn">Click on a column to change the content.</p>
            //         </div>
            //     </div>
            // </div>
            );
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
