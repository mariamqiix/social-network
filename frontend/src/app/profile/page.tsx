'use client';
import { useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";
import "../../../public/profilePage.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faCalendarDay, faEnvelope, faSignature } from "@fortawesome/free-solid-svg-icons";
import { ProfilePageView } from "../types/Types";
import { fetchProfileData } from "./fetch";
import Post from '../components/GroupPostContent';
import React, { useRef, useState, useEffect } from 'react';

export default function page() {
    const [profileData, setProfileData] = useState<ProfilePageView>({
        user: {
            id: 0,
            username: '',
            nickname: '',
            firstName: '',
            lastName: '',
            email: '',
            image_url: '',
            bio: '',
            dob: '',
        },
        UserPosts: [],
        UserLikedPost: [],
        UserDislikedPost: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProfileData();
                setProfileData(data);
                console.log(data)
                console.log(profileData)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleTabClick = (tabName: string) => {
        switch (tabName) {
            case 'Posts':
                setIsMember(false);  // Update the membership status
                setActiveTab(tabName);
                // send a request to leave the group
                break;
            case 'LikedPosts':
                setActiveTab(tabName);
                // RequestToJoin();
                // send a request to join the group
                break;
            case 'DisLikedPosts':
                setActiveTab(tabName);
                // RequestToJoin();
                // send a request to join the group
                break;
            default:
                setActiveTab(tabName);

        }
    };

    const [isMember, setIsMember] = useState(true);
    const [activeTab, setActiveTab] = useState('Posts');

    return (
        <div className="Container">

            {/* Profile Header */}
            <div className="ProfilePageHeader">
                <div className="profile-info">
                    <img
                        // src={`data:image/jpeg;base64,${profileData.Image}`}
                        alt="Avatar"
                        className="profile-avatar"
                    />

                    <div className="profile-details">
                        <h1 className="profile-name">{profileData.user.firstName} {profileData.user.lastName} ({profileData.user.username})</h1>
                        <p className="profile-desc">{profileData.user.bio}</p>
                        {/* <p className="profile-desc">{calculateAge(profileData.user.DateOfBirth)}</p> */}
                        <p className="profile-desc">{profileData.user.email}</p>

                        <div className="profile-follow-info">
                            {/* {profileData.Followers &&
                                // <span>{profileData.Followers ? profileData.Followers.length : 0} Member</span>
                            } */}
                        </div>
                    </div>
                </div>

                {profileData && ( //--isMember
                    <div className="button-container">
                        <button className="expandable-button button-1" >
                            {/* onClick={() => setIsPostPopupOpen(true)}> */}
                            {/* <FontAwesomeIcon icon={faPlus} className="icon" style={{ color: '#f35366' }} /> */}
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
                        className={activeTab === 'LikedPosts' ? 'active' : ''}
                        onClick={() => handleTabClick('LikedPosts')}
                    >
                        Likes
                    </li>

                    <li
                        className={activeTab === 'DisLikedPosts' ? 'active' : ''}
                        onClick={() => handleTabClick('DisLikedPosts')}
                    >
                        Dislikes
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="content-area">
                {activeTab === 'Posts' && (
                    <div className="posts-section" >
                        <div
                            id="group-post"
                            style={{
                                marginTop: "1.5%",
                                width: "100%",
                                display: "grid", // Use CSS Grid
                                gridTemplateColumns: "repeat(2, minmax(380px, 1fr))", // Auto-adjust columns
                                gap: "30px", // Space between posts
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {profileData.UserPosts && profileData.UserPosts.map((post, index) => (
                                <Post post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // return <h1>You need to login</h1>;
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