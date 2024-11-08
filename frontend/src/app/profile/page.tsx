'use client';
import "../../../public/profilePage.css";
import Image from "next/image";
import { fetchProfileData } from "./fetch";
import React, { useState, useEffect } from 'react';
import PostContent from "../components/PostContent";
import PostActions from '../components/PostActions';
import { Post, ProfilePageView } from "../types/Types";
import { likePost } from "../redux/actions";
import { selectPosts, selectUser } from "../redux/selectors";
import { randomColor } from "../components/colors";
import { useDispatch, useSelector } from "react-redux";


export default function page() {
    const [profileData, setProfileData] = useState<any>();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('Posts');
    var posts = useSelector(selectPosts);
    var [posts, setposts] = useState<Post[]>([]);


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
                setActiveTab(tabName);
                handlePostData(profileData?.user_posts)
                break;

            case 'LikedPosts':
                setActiveTab(tabName);
                handlePostData(profileData?.user_Liked_posts)
                break;

            case 'DisLikedPosts':
                setActiveTab(tabName);
                handlePostData(profileData?.user_Disliked_posts)
                break;

            default:
                setActiveTab(tabName);
                // handlePostData(profileData?.user_posts)
                break;
        }
    };

    const handlePostData = (postsArray) => {
        setposts(postsArray)
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
                            {/* {profileData?.followigs &&
                                <span>{profileData.followigs ? profileData.Followers.followigs : 0} Member</span>
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

                    <li
                        className={activeTab === 'Followers' ? 'active' : ''}
                        onClick={() => handleTabClick('Followers')}
                    >
                        Followers
                    </li>

                    <li
                        className={activeTab === 'Following' ? 'active' : ''}
                        onClick={() => handleTabClick('Following')}
                    >
                        Following
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <main style={{ display: 'flex', flexDirection: 'column' }}>
                {posts != null ?
                    (posts.map((post: Post, index: number) => (
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
                                name={post.author.username}
                                time={post.created_at}
                                content={post.content}
                                images={post.image_url === "" ? [] : []}
                                id={post.id.toString()}
                            />
                            <PostActions likes={post.likes.count} liked={() => likePostClicked(post.id)} />
                        </div>
                    ))) : activeTab != "Followers" && activeTab != "Following" && (
                        <div>
                            <br>
                            </br>
                            <p>No posts available</p>
                        </div>
                    )}
            </main>

            {activeTab === 'Followers' && profileData.followers && (
                <div className="members-section">
                    <ul className="member-list">
                        {profileData?.followers.map((member) => (
                            <li key={member.id} className="member-item">
                                <img src={`data:image/jpeg;base64,${member.image_url}`} alt={member.username} className="member-image" />
                                <div className="member-details">
                                    <h3 className="member-name">{member.username}</h3>
                                    <p className="member-username">{member.nickname}</p> {/* Username added here */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'Following' && profileData.following && (
                <div className="members-section">
                    <ul className="member-list">
                        {profileData?.followigs.map((member) => (
                            <li key={member.id} className="member-item">
                                <img src={`data:image/jpeg;base64,${member.image_url}`} alt={member.username} className="member-image" />
                                <div className="member-details">
                                    <h3 className="member-name">{member.username}</h3>
                                    <p className="member-username">{member.nickname}</p> {/* Username added here */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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

