'use client'; // Add this line at the very top to mark the component as a Client Component
import React, { useState } from 'react';
import Post from '../../components/GroupPostContent'; // Adjust the path if necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';

const groupData = [
    {
        id: 1,
        image: 'https://picsum.photos/200/300?random=5',
        name: 'Eat Corn on the Cob',
        description: 'Join us for a fun event filled with delicious corn and great company!',
        date: 'Tue, Jan 9, 5:00 PM',
        location: 'Austin, TX',
        attendees: 256,
        friends: [
            'https://picsum.photos/40/40?random=1', // Friend 1
            'https://picsum.photos/40/40?random=2', // Friend 2
            'https://picsum.photos/40/40?random=3', // Friend 3
            'https://picsum.photos/40/40?random=4', // Friend 4
        ],
    },
    {
        id: 2,
        image: 'https://picsum.photos/200/300?random=5',
        name: 'Wine Tasting Experience',
        description: 'Explore a variety of wines in a beautiful vineyard setting.',
        date: 'Sun, Feb 15, 3:00 PM',
        location: 'Napa Valley, CA',
        attendees: 150,
        friends: [
            'https://picsum.photos/40/40?random=5', // Friend 1
            'https://picsum.photos/40/40?random=6', // Friend 2
        ],
    },
    {
        id: 3,
        image: 'https://picsum.photos/200/300?random=5',
        name: 'Live Music Night',
        description: 'Enjoy live performances from local bands at the park.',
        date: 'Sat, Mar 21, 6:00 PM',
        location: 'Central Park, NY',
        attendees: 300,
        friends: [
            'https://picsum.photos/40/40?random=7', // Friend 1
            'https://picsum.photos/40/40?random=8', // Friend 2
            'https://picsum.photos/40/40?random=9', // Friend 3
        ],
    },
    {
        id: 4,
        image: 'https://picsum.photos/200/300?random=5',
        name: 'Cooking Class',
        description: 'Learn to cook delicious dishes from around the world!',
        date: 'Wed, Apr 12, 2:00 PM',
        location: 'Chicago, IL',
        attendees: 85,
        friends: [
            'https://picsum.photos/40/40?random=10', // Friend 1
            'https://picsum.photos/40/40?random=11', // Friend 2
            'https://picsum.photos/40/40?random=12', // Friend 3
            'https://picsum.photos/40/40?random=13', // Friend 4
        ],
    },
    {
        id: 5,
        image: 'https://picsum.photos/200/300?random=5',
        name: 'Yoga Retreat',
        description: 'Relax and rejuvenate at a peaceful yoga retreat.',
        date: 'Sat, May 25, 10:00 AM',
        location: 'Sedona, AZ',
        attendees: 120,
        friends: [
            'https://picsum.photos/40/40?random=14', // Friend 1
            'https://picsum.photos/40/40?random=15', // Friend 2
            'https://picsum.photos/40/40?random=16', // Friend 3
            'https://picsum.photos/40/40?random=17', // Friend 4
        ],
    },
    {
        id: 6,
        image: 'https://picsum.photos/200/300?random=5',
        name: 'Photography Workshop',
        description: 'Join us for a hands-on photography workshop in nature.',
        date: 'Sun, Jun 30, 1:00 PM',
        location: 'Yosemite, CA',
        attendees: 75,
        friends: [
            'https://picsum.photos/40/40?random=18', // Friend 1
            'https://picsum.photos/40/40?random=19', // Friend 2
            'https://picsum.photos/40/40?random=20', // Friend 3
        ],
    },
];


const GroupPage = () => {
    const [activeTab, setActiveTab] = useState('Posts');

    const [isMember, setIsMember] = useState(true); // Set this based on the group membership

    const handleTabClick = (tabName: string) => {
        switch (tabName) {
            case 'Leave':
                setIsMember(false);  // Update the membership status
                setActiveTab('Posts');
                // send a request to leave the group
                break;
            case 'Join':
                setActiveTab('Posts');
                // send a request to join the group
                break;
            default:
                setActiveTab(tabName);
        }
    };

    return (
        <div className="group-page-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-info">
                    <img
                        src="https://picsum.photos/200/300?random=5"
                        alt="Avatar"
                        className="profile-avatar"
                    />
                    <div className="profile-details">
                        <h1 className="profile-name">Fredy Mercury</h1>
                        <p className="profile-desc">
                            Alzea Arafat, an Indonesian-based senior UI/UX designer with more than 10 years of experience in various industries from early-stage startups to unicorns. His hobby is playing games.
                        </p>
                        <div className="profile-follow-info">
                            <span>1.25k Member</span>
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button className="expandable-button button-1">
                        <FontAwesomeIcon icon={faPlus} className="icon" style={{ color: '#f35366' }} />
                        <span>Create Post</span>
                    </button>

                    <button className="expandable-button button-2">
                        <FontAwesomeIcon icon={faCalendarDays} className="icon" style={{ color: '#4CAF50' }} />
                        <span style={{ color: '#4CAF50' }}>Create Event</span>
                    </button>

                    <button className="expandable-button button-3">
                        <FontAwesomeIcon icon={faUser} className="icon" style={{ color: ' #2196F3' }} />
                        <span style={{ color: ' #2196F3' }}>Invite Member</span>
                    </button>
                </div>
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
                        onClick={() => handleTabClick('Events')}
                    >
                        Events
                    </li>

                    <li
                        className={activeTab === 'Members' ? 'active' : ''}
                        onClick={() => handleTabClick('Members')}
                    >
                        Members
                    </li>
                    <li onClick={() => handleTabClick(isMember ? 'Leave' : 'Join')}>
                        {isMember ? 'Leave' : 'Join'}
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="content-area">
                {activeTab === 'Events' && (
                    <div className="events-section">
                        <div className="group-card-container">
                            {groupData.map((group) => (
                                <div key={group.id} className="group-card">
                                    <img src={group.image} alt={group.name} className="group-image" />

                                    <div className="group-details">
                                        <div className="event-icons">
                                            <span className="icon-check">✔️</span>
                                            <span className="icon-heart">❤️</span>
                                            <span className="icon-cross">❌</span>
                                        </div>

                                        <p className="group-date"><i className="icon-calendar"></i> {group.date}</p>
                                        <h3 className="eventTitle">{group.name}</h3>
                                        <p className="group-location">{group.location}</p>

                                        {/* Display images of friends, showing only the first three and a + if there are more */}
                                        <p className="group-friends">
                                            <i className="icon-friends"></i>
                                            {group.friends.slice(0, 3).map((friend, index) => (
                                                <img key={index} src={friend} alt={`Friend ${index + 1}`} className="friend-image" />
                                            ))}
                                            {group.friends.length > 3 && (
                                                <span className="frindsText"> + {group.friends.length - 3} friends are going</span>
                                            )}
                                            {group.friends.length <= 3 && (
                                                <span className="frindsText">{group.friends.length} friends are going</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Posts' && (
                    <div className="posts-section" >
                        <div
                            id="group-post"
                            style={{
                                marginTop: "1.5%",
                                width: "100%",
                                display: "grid", // Use CSS Grid
                                gridTemplateColumns: "repeat(2, minmax(450px, 1fr))", // Auto-adjust columns
                                gap: "30px", // Space between posts
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {postsData.map((post, index) => (
                                <Post index={post.groupName} post={post} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Members' && (
                    <div className="members-section">
                        <ul className="member-list">
                            {members.map((member) => (
                                <li key={member.id} className="member-item">
                                    <img src={member.image} alt={member.name} className="member-image" />
                                    <div className="member-details">
                                        <h3 className="member-name">{member.name}</h3>
                                        <p className="member-username">{member.username}</p> {/* Username added here */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'Leave' && (
                    <div className="leave-section">
                        <h2>Leave</h2>
                        <p>Leave content goes here...</p>
                    </div>
                )}
            </div>






            {/* Embedded CSS */}
            <style jsx>{`
            /* App Styles */

                /* Container Styles */
                .button-container {
                position:absolute;
                z-index: 100;
                float: right;
                right: 80px;
                display: flex;
                gap: 15px; /* Space between buttons */
                align-items: center;
                top:120px;
                height: 40px;
                }

                .expandable-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    border: 2px solid #f35366; /* Default border */
                    border-radius: 50px;
                    padding: 0 15px;
                    height: 50px;
                    width: 50px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    color: #f35366; /* Default text color */
                    transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease, padding 0.4s ease; /* Smoother transition for width */
                    white-space: nowrap;
                    overflow: hidden;
                    position: relative;
                }

                /* Icon styles: initially centered */
                .expandable-button .icon {
                position: absolute;
                transform: translateX(-50%); /* Center the icon in the circle */
                transition: left 0.9s ease, transform 0.4s ease;
                }

                /* Hover effect */
                .expandable-button:hover {
                 width: auto; /* Expand width on hover */
                justify-content: flex-start; /* Align items to the left when expanded */
                transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1); /* Smoother width transition */
                
                }

                /* Move the icon to the left of the text on hover */
                .expandable-button:hover .icon {
                left: 10px; /* Move the icon to the left inside the expanded button */
                transform: translateX(0); /* No more centering */
                }

                /* Initially hide the text */
                .expandable-button span {
                margin-left: 5px; /* Reduce space between icon and text */
                display: none;
                }

                /* Show the text on hover */
                .expandable-button:hover span {
                display: inline;
                }

                /* Different colors for each button border and icon */
                .button-1 {
                border-color: #f35366; /* Red for Add Post */
                }
                .button-2 {
                border-color: #4CAF50; /* Green for Add Event */
                }

                .button-2 .icon {
                background-color: #4CAF50; /* Icon matches the border color */
                }

                .button-3 {
                border-color: #2196F3; /* Blue for Invite Member */
                }

                .button-3 .icon {
                    background-color:: #2196F3; /* Icon matches the border color */
                }

                .profile-info {
                    display: flex;
                    width: 100%;
                }

                .group-page-container {
                    width: 95%;
                    margin-left: 2.5%;
                    font-family: Arial, sans-serif;
                    height: 100%; /* Ensure full height stretch */
                }

                .profile-header {
                    height: 300px;
                    display: flex;
                    align-items: center;
                    background: #fff;
                    padding: 20px;
                    border-radius: 15px;
                    margin-top: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    width: 100%; /* Stretch to full width */
                }

                .profile-avatar {
                    margin: auto;
                    margin-left: 40px;
                    width: 255px;
                    height: 210px; /* Adjust to keep it proportional */
                    border-radius: 200px;
                    border: 2px solid #e0e0e0;
                }

                .profile-details {
                    margin-left: 40px;
                    flex-grow: 1; /* Allows profile details to stretch */
                    width: 100%; /* Ensures it fills available width */
                }

                .profile-name {
                    font-size: 42px;
                    font-weight: bold;
                    margin: 10px 0;
                }

                .profile-desc {
                    font-size: 20px;
                    color: #555;
                    margin: 20px 0;
                }

                .profile-follow-info {
                margin-top: 30px;
                    font-size: 16px;
                    color: #888;
                }

                .list-bar {
                    margin-top: 20px;
                    background: #fff;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center; /* Aligns the entire list horizontally */
                    align-items: center; /* Centers the items vertically */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 100%; /* Stretches to full width */
                }

                .list-bar ul {
                    height: 60px;
                    margin: 10px;
                    list-style: none;
                    display: flex;
                    justify-content: space-between; /* Adds space between the list items */
                    width: 100%; /* Stretches to full width */
                    padding: 0;
                    gap: 10px; /* Adds space between the li elements */
                }

                .list-bar li {
                    display: flex;
                    justify-content: center; /* Center text horizontally */
                    align-items: center; /* Center text vertically */
                    font-size: 20px;
                    cursor: pointer;
                    padding: 10px 20px;
                    margin-bottom: 0;
                    border-radius: 8px;
                    transition: background-color 0.3s ease;
                    flex-grow: 1; /* Ensures each li stretches evenly across the width */
                    text-align: center; /* Center the text */
                    width: 100%; /* Ensure li takes full width */
                }

                .list-bar li.active {
                    background-color: gray;
                    color: white;
                }

                .list-bar li:hover {
                    background-color: #e0e0e0;
                }

                .group-card-container {
                    padding: 0px 0px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Flexible grid */
                    margin-top: 20px;
                    gap: 20px; /* Space between grid items */
                    border-radius: 20px;
                    width: 100%; /* Full width */
                    height: 100%; /* Full height */
                    overflow-x: hidden;
                }

                .group-card {
                    background: #fff;
                    border-radius: 15px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: transform 0.3s ease;
                    width: 100%;
                    min-width: 200px;
                    position: relative;
                    height: 410px;
                    padding-bottom: 15px;
                }

                .group-card:hover {
                    transform: translateY(-5px);
                }

                .group-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }

                .group-details {
                    padding: 15px;
                    text-align: center;
                }

                .event-icons {
                    position: absolute;
                    top: 115px;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin: 10px 0;
                    margin-bottom: 10px;
                }

                .icon-check, .icon-heart, .icon-cross {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow effect */

                background-color: rgba(255, 255, 255,0.9);
                border-radius: 50%;
                padding: 10px;
                    font-size: 20px;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .icon-check:hover, .icon-heart:hover, .icon-cross:hover {
                    transform: scale(1.2);
                }

                .group-date {
                margin-top: 25px;
                    font-size: 14px;
                    color: #888;
                    margin-bottom: 20px;
                }

                .group-location, .group-attendees, .group-friends {
                    font-size: 14px;
                    color: #555;
                    margin-bottom: 10px;
                }


                .icon-calendar, .icon-friends {
                    margin-right: 5px;
                }

               .group-friends {
                    position: absolute;
                    bottom: 10px;
                    display: flex; /* Makes the content inline */
                    align-items: center; /* Aligns text and images vertically */
                    font-size: 14px; /* Adjust font size as needed */
                    color: #888; /* Text color */
                }

                .friends-images {
                    display: flex; /* Arrange images in a row */
                    margin-right: 5px; /* Space between images and text */
                }

                .friend-image {
                    width: 30px; /* Adjust as needed */
                    height: 30px; /* Adjust as needed */
                    border-radius: 50%; /* Makes the image circular */
                    margin-top: -10px; /* Overlap images */
                    margin-left: 5px; /* Space between images */
                    position: relative; /* Required for absolute positioning */
                }
                
                .eventTitle {
                    font-size: auto;
                }
                .frindsText {
                    float:left;
                    margin-left: 5px;}


                .members-section {
                    padding: 20px 30px; /* Increased padding */
                }

                .member-list {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }

                .member-item {
                    display: flex;
                    align-items: center;
                    padding: 20px 0; /* Increased padding between items */
                    border-bottom: 1px solid #e0e0e0;
                }

                .member-image {
                    width: 70px; /* Increased image size */
                    height: 70px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-right: 20px; /* Increased spacing between image and text */
                }

                .member-details {
                    display: flex;
                    flex-direction: column;
                }

                .member-name {
                    font-size: 20px; /* Increased font size for name */
                    font-weight: 700; /* Bolder font for name */
                    margin: 0;
                    color: #333;
                }

                .member-username {
                    font-size: 16px; /* Increased font size for username */
                    color: #666; /* Slightly darker color */
                    margin: 6px 0 0 0;
                }


            `}</style>
        </div>
    );
};

export default GroupPage;

const members = [
    {
        id: 1,
        name: 'Leila Byrd',
        username: 'thisIsAUsername',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
        id: 2,
        name: 'Matthew',
        username: 'llimvx',
        image: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
    // Add more members as needed...
];



const postsData = [
    {
        groupName: "Dribbble Shots Community",
        groupImage: 'https://picsum.photos/200/300?random=5',
        username: "Jonathan",
        userImage: "https://picsum.photos/200/300?random=2",
        time: "Just Now",
        content: "Hi guys, today I’m bringing you a UI design for Logistic Website.",
        postImage: "https://picsum.photos/200/300?random=3",
    },
    {
        groupName: "Code Newbie",
        groupImage: 'https://picsum.photos/200/300?random=5',
        username: "Alice",
        userImage: "https://picsum.photos/200/300?random=5",
        time: "2 hours ago",
        content: "Excited to share my first open-source contribution!",
        postImage: "https://picsum.photos/200/300?random=6",
    },
    // Extra posts
    {
        groupName: "Creative Designers",
        groupImage: 'https://picsum.photos/200/300?random=5',
        username: "Eve",
        userImage: "https://picsum.photos/200/300?random=8",
        time: "1 day ago",
        content: "Here’s a sneak peek of my latest design project. Hope you like it!",
        postImage: "https://picsum.photos/200/300?random=9",
    },
    {
        groupName: "Tech Enthusiasts",
        groupImage: 'https://picsum.photos/200/300?random=5',
        username: "Mark",
        userImage: "https://picsum.photos/200/300?random=11",
        time: "3 days ago",
        content: "Just started learning about blockchain technology. It’s fascinating!",
        postImage: "https://picsum.photos/200/300?random=12",
    },
    // Add more posts as needed
];
