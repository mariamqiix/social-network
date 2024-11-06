'use client';
import "../../../public/profilePage.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faCalendarDay, faEnvelope, faSignature } from "@fortawesome/free-solid-svg-icons";
import { ProfilePageView } from "../types/Types";
import { fetchProfileData } from "./fetch";
import React, { useRef, useState, useEffect } from 'react';
import PostContent from "../components/PostContent";
import PostActions from '../components/PostActions';
import { Post } from "../types/Types";
import { addPost, clearPosts, likePost } from "../redux/actions";
import { selectPosts, selectUser } from "../redux/selectors";
import { colors, randomColor } from "../components/colors";
import { useDispatch, useSelector } from "react-redux";


export default function page() {
    const [profileData, setProfileData] = useState<any>();
    const dispatch = useDispatch();
    const [isMember, setIsMember] = useState(true);
    const [activeTab, setActiveTab] = useState('Posts');
    var posts = useSelector(selectPosts);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProfileData();
                setProfileData(data);
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
                handlePostData(profileData.user_posts)
                break;

            case 'LikedPosts':
                setActiveTab(tabName);
                handlePostData(profileData.user_Liked_posts)
                break;

            case 'DisLikedPosts':
                setActiveTab(tabName);
                handlePostData(profileData.user_Disliked_posts)
                break;

            default:
                setActiveTab(tabName);
                handlePostData(profileData.user_posts)
                break;
        }
    };

    const handlePostData = (postsArray) => {
        clearPosts();
        if (Array.isArray(postsArray)) {
            postsArray.forEach((post) => {
                if (post) {
                    dispatch(addPost({
                        id: post.id,
                        author: { name: post.author.username, avatar: "/placeholder.jpg" },
                        time: post.created_at,
                        content: post.content,
                        images: post.image_url === "" ? [] : [],
                        likes: post.likes.count
                    }));
                }
            });
        }
    };

    function likePostClicked(id: Number) {
        fetch("http://localhost:8080/post/addReaction", { method: "POST", credentials: 'include', body: JSON.stringify({ post_id: id, reaction: "Like" }) }).then((res) => {
            console.log(res.status);
            if (res.status == 204) {
                dispatch(likePost(id, -1));
            } else if (res.status == 201) {
                dispatch(likePost(id, 1));
            }
        });
    }

    return (
        <div className="Container">
            {/* Profile Header */}
            <div className="ProfilePageHeader">
                <div className="profile-info">
                    <img
                        // src={`data:image/jpeg;base64,${profileData?.image_url}`}
                        alt="Avatar"
                        className="profile-avatar"
                    />

                    <div className="profile-details">
                        <h1 className="profile-name">{profileData?.user.first_name} {profileData?.user.last_name} ({profileData?.user.username})</h1>
                        <p className="profile-desc">{profileData?.user.bio}</p>
                        {/* <p className="profile-desc">{calculateAge(profileData?.DateOfBirth)}</p> */}
                        <p className="profile-desc">{profileData?.user.email}</p>

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
            <main style={{ display: 'flex', flexDirection: 'column' }}>
                {posts.map((post: Post, index: number) => (
                    <div key={index} className="card shadow-sm p-4" style={{
                        width: '100%',
                        maxWidth: '900px',
                        margin: '10px 0',
                        padding: '10px',
                        border: '1px solid #e1e1e1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: randomColor(),
                    }}>
                        <PostContent
                            avatar={post.author.avatar}
                            name={post.author.name}
                            time={post.time}
                            content={post.content}
                            images={post.images}
                            id={post.id.toString()}
                        />
                        <PostActions likes={post.likes} liked={() => likePostClicked(post.id)} />
                    </div>
                ))}
            </main>
        </div>
    );
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

