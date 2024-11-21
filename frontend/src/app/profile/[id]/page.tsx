'use client';
import "../../../../public/profilePage.css";
import { fetchProfileData } from "./fetch";
import React, { useState, useEffect } from 'react';
import PostContent from "../../components/PostContent";
import PostActions from '../../components/PostActions';
import { Post } from "../../types/Types";
import { likePost } from "../../redux/actions";
import { randomColor } from "../../components/colors";
import { useDispatch, useSelector } from "react-redux";
import Metadata from "../../components/Metadata";
import { selectUser } from "../../redux/selectors";

export default function page(params: any) {
    let id = Number.parseInt(params.params.id) ?? 1;
    // console.log(id);
    const user = useSelector(selectUser);
    const [profileData, setProfileData] = useState<any>();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('Posts');

    var [posts, setposts] = useState<Post[]>([]);
    var [follows, setFollows] = useState([]);
    var [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProfileData(id);
                setProfileData(data);
                setIsActive(data.is_user_profile || data.user_status == "Accepted" || data.user_profile_type == "Public");
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const handleTabClick = (tabName: string) => {
        switch (tabName) {
            case 'Posts':
                setposts(profileData?.user_posts)
                break;

            case 'LikedPosts':
                setposts(profileData?.user_Liked_posts)
                break;

            case 'Followers':
                setFollows(profileData?.followers)
                break;

            case 'Following':
                setFollows(profileData?.followigs)
                break;

            default:
                setposts([])
                setFollows([])
                break;
        }

        setActiveTab(tabName);
    };

    // Function to handle when the button is disabled
    const handleUnableClick = () => {
        // Do nothing as the button is disabled
    };

    const handleFollowRequest = () => {
        fetch("http://localhost:8080/user/responds/requestToFollow", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({ user_id: profileData.user.id, response: '' })
        });

        const updatedProfileData = { ...profileData };

        if (profileData.user_profile_type === "Public") {
            updatedProfileData.user_status = "Accepted"
        } else {
            updatedProfileData.user_status = "Pending"
        }

        // Set the updated profileData
        setProfileData(updatedProfileData);
    }

    const handleUnfollowRequest = () => {
        fetch("http://localhost:8080/user/responds/requestToUnfollow", { method: "POST", credentials: 'include', body: JSON.stringify({ user_id: profileData?.user.id, reaction: '' }) }).then((res) => {
            console.log(res.status);
        });

        const updatedProfileData = { ...profileData };
        updatedProfileData.user_status = "";

        // Set the updated profileData
        setProfileData(updatedProfileData);
    }

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
            <Metadata seoTitle={"Friendz | " + profileData?.user.username} seoDescription="The next gen social network" />
            {/* Profile Header */}
            <div className="ProfilePageHeader">
                <div className="profile-info">
                    <img
                        src={`data:image/jpeg;base64,${profileData?.user.image_url}`} alt={profileData?.user.username}
                        className="profile-avatar"
                    />

                    {profileData != null && (
                        <div className="profile-details">
                            <h1 className="profile-name">{profileData?.user.first_name} {profileData?.user.last_name} ({profileData?.user.username})</h1>
                            <p className="profile-desc">{profileData?.user.bio}</p>
                            {isActive && (
                                <div>
                                    <p className="profile-desc">{calculateAge(profileData?.user.DateOfBirth)} Years</p>
                                    <p className="profile-desc">{profileData?.user.email}</p>
                                </div>
                            )
                            }

                            <div className="profile-follow-info">
                                {!profileData?.is_user_profile ? (
                                    <div className="button-container">
                                        {profileData?.user_status === "" ? (
                                            <button className="followBtn requestBtn"
                                                onClick={() => handleFollowRequest()}>
                                                <span>Follow</span>
                                            </button>

                                        ) : (profileData?.user_status === "Accepted") ? (
                                            <button className="unfollowBtn requestBtn"
                                                onClick={() => handleUnfollowRequest()}>
                                                <span>UnFollow</span>
                                            </button>

                                        ) : profileData?.user_status === "Pending" && (
                                            <button className="pendingBtn requestBtn"
                                                onClick={() => handleUnfollowRequest()}>
                                                <span>Requested</span>
                                            </button>
                                        )
                                        }

                                    </div>)
                                    : <div className="button-container">
                                        <select className="form-select form-select-lg" value={profileData.user_profile_type} onChange={(e) => {
                                            console.log(e.target.value);
                                            fetch("http://localhost:8080/user/changePrivacy/", { method: "POST", credentials: 'include', body: JSON.stringify({ user_id: user?.id, privacy: e.target.value }) }).then((res) => {
                                                if (res.ok) {
                                                    window.location.reload();
                                                    // profileData.user_profile_type = e.target.value;
                                                    // setProfileData(profileData);
                                                } else {
                                                    res.text().then((data) => {
                                                        alert(data);
                                                    });
                                                }
                                            });
                                        }}>
                                            <option>Public</option>
                                            <option>Private</option>
                                        </select>
                                    </div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="list-bar">
                <ul>
                    <li className={activeTab === 'Posts' ? 'active' : ''} onClick={() => handleTabClick('Posts')}>
                        Posts
                    </li>

                    <li className={activeTab === 'LikedPosts' ? 'active' : ''} onClick={() => handleTabClick('LikedPosts')}>
                        Likes
                    </li>

                    <li
                        className={`list-item ${activeTab === 'Followers' ? 'active' : ''} ${(isActive) ? '' : 'disabled-button'} ${(isActive) ? '' : 'inactive'}`}
                        onClick={isActive ? () => handleTabClick('Followers') : () => handleUnableClick()}>
                        Followers
                    </li>

                    <li
                        className={`list-item ${activeTab === 'Following' ? 'active' : ''} ${(isActive) ? '' : 'disabled-button'} ${(isActive) ? '' : 'inactive'}`}
                        onClick={isActive ? () => handleTabClick('Following') : () => handleUnableClick()}>
                        Following
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <main style={{ display: 'flex', flexDirection: 'column' }}>
                {(activeTab == "Posts" || activeTab === "LikedPosts") &&
                    (posts != null ?
                        (posts.map((post: Post, index: number) => (
                            <div key={index} className="card shadow-sm p-4" style={{
                                width: '100%',
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
                                    avatar={"data:image/jpeg;base64," + post.author.image_url}
                                    name={post.author.username}
                                    userID={post.author.id}
                                    time={post.created_at}
                                    content={post.content}
                                    images={post.image_url === "" ? [] : ["data:image/jpeg;base64," + post.image_url]}
                                    id={post.id.toString()}
                                />
                                <PostActions likes={post.likes.count} liked={() => likePostClicked(post.id)} />
                            </div>
                        ))) : (
                            <div>
                                <br>
                                </br>
                                <p>No Post Available</p>
                            </div>
                        ))}

            </main>

            {(activeTab === 'Followers' || activeTab === 'Following') && (
                <div className="members-section">
                    <ul className="member-list">
                        {follows != null && follows.map((member) => (
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

