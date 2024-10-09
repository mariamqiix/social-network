'use client'; // Add this line at the very top to mark the component as a Client Component
import React, { useState, ReactElement, useEffect } from 'react';
import Post from '../../components/GroupPostContent'; // Adjust the path if necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPlus, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import "./groupPage.css";

import * as FaIcons from 'react-icons/fa'; // Import all FontAwesome icons
import * as MdIcons from 'react-icons/md'; // Import all Material Design icons

async function fetchGroupData() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/group/page?id=${id}`; // Append the id to the URL

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData = await response.json();
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}


async function fetchMembers() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/group/UsersToInvite?id=${id}`; // Append the id to the URL

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData = await response.json();
        console.log(groupData);
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}

async function fetchEventData() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/group/event/list/group?id=${id}`;

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData = await response.json();
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}

type GroupInviteRequest = {
    group_id: number;
    user_id: number;
};

function sendInvite(memberId: number) {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string

    if (!id) {
        console.error('Group ID not found in the query string');
        return;
    }

    const invite: GroupInviteRequest = {
        group_id: parseInt(id, 10),
        user_id: memberId,
    };

    const url = `http://localhost:8080/group/inviteUser`;

    fetch(url, {
        method: 'POST',
        credentials: 'include', // This is the key to include cookies
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invite),
    })
        .then(response => {
            if (response.ok) {
                console.log('Invite sent successfully');
            } else {
                console.error('Failed to send invite');
            }
        })
        .catch(error => {
            console.error('Error sending invite:', error);
        });
}

async function LeaveGroup() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string

    if (!id) {
        console.error('Group ID not found in query string');
        return;
    }

    const url = `http://localhost:8080/group/leaveGroup?id=${id}`;

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }
        console.log('Successfully left the group');
    } catch (error) {
        console.error('Error leaving the group:', error);
    }
}



async function RequestToJoin() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string

    if (!id) {
        console.error('Group ID not found in query string');
        return;
    }

    const url = `http://localhost:8080/group/requestToJoin?id=${id}`;

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        console.log('Successfully request the group');
    } catch (error) {
        console.error('Error requesting the group:', error);
    }
}

const GroupPage = () => {
    const [activeTab, setActiveTab] = useState('Posts');

    const [isMember, setIsMember] = useState(true); // Set this based on the group membership

    const handleTabClick = (tabName: string) => {
        switch (tabName) {
            case 'Leave':
                setIsMember(false);  // Update the membership status
                setActiveTab('Posts');
                LeaveGroup();

                useEffect(() => {
                    const getData = async () => {
                        const data = await fetchGroupData();
                        console.log(data);
                        if (data.Group.is_user_member) {
                            setIsMember(true)
                        }
                        console.log(data.Group.is_user_member)
                        setProfileData(data);
                    };

                    getData();
                }, []);

                const [groupEvent, setGroupEvent] = useState([]);

                useEffect(() => {
                    const getData = async () => {
                        const data = await fetchEventData();
                        console.log(data);
                        setGroupEvent(data);
                    };

                    getData();
                }, []);

                // send a request to leave the group
                break;
            case 'Join':
                setActiveTab('Posts');
                RequestToJoin();
                // send a request to join the group
                break;
            default:
                setActiveTab(tabName);
        }
    };

    // State to track if the list is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // State to handle search input
    const [searchTerm, setSearchTerm] = useState('');

    // Function to toggle the list
    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    // Function to close the list
    const closeList = () => {
        setIsOpen(false);
    };


    const [postImage, setPostImage] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isPostPopupOpen, setIsPostPopupOpen] = useState<boolean>(false);

    // Function to close the popup
    const closePopup = () => {
        setPopupOpen(false);
        setIsPostPopupOpen(false);
        setPostImage(null); // Reset image when closing
        setDescription('');  // Reset description when closing
    };

    // Function to handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    // Function to handle post creation
    // Function to handle post creation
    const handlePostCreation = async () => {
        if (description || postImage) {
            const postData = {
                group_id: parseInt(id, 10), // Convert id to an integer
                description: description,
                image: postImage ? postImage.split(',')[1] : null, // Send only the base64 part
            };
            try {
                console.log(postData)
                const response = await fetch('http://localhost:8080/post/createPost/group', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // This is the key to include cookies
                    body: JSON.stringify(postData),
                });

                if (!response.ok) {
                    throw new Error(`Error: status code ${response.status}`);
                }

                console.log('Post created:');
                closePopup();
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else {
            alert('Please add a description or image before posting.');
        }
    };


    const [isPopupOpen, setPopupOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDateTime, setEventDateTime] = useState("");
    const [options, setOptions] = useState([{ name: "", icon: <FaIcons.FaQuestionCircle /> }]); // Default icon
    const [isIconPickerOpen, setIconPickerOpen] = useState([false]);

    const openPopup = () => {
        setPopupOpen(true);
    };


    const getIconComponent = (iconDisplayName: string) => {
        if (!iconDisplayName || typeof iconDisplayName !== 'string') {
            console.error('Icon display name is not provided or is invalid');
            return null; // Return null if iconDisplayName is not valid
        }

        // Capitalize the first letter and ensure "Fa" prefix
        const iconKey = `${iconDisplayName.charAt(0).toUpperCase() + iconDisplayName.slice(1)}` as keyof typeof FaIcons;
        const IconComponent = FaIcons[iconKey];

        if (!IconComponent) {
            console.error(`Icon "${iconDisplayName}" not found in react-icons/fa. Constructed Key: ${iconKey}`);
            return null; // Return null if the icon doesn't exist
        }

        return <IconComponent />;
    };

    const formatDateTime = (dateTimeStr: string): string => {
        const date = new Date(dateTimeStr);
        return date.toISOString(); // Converts to "2024-10-09T22:19:00.000Z"
    };
    const handleCreateEvent = async () => {
        if (eventTitle && eventDescription && eventDateTime) {
            const eventOptions = options.map(option => ({
                option: option.name,
                icon_name: option.icon.type.displayName || option.icon.type.name // Convert icon to string representation
            }));

            const eventData = {
                title: eventTitle,
                description: eventDescription,
                group_id: parseInt(id, 10), // Convert id to an integer
                options: eventOptions,
                time: formatDateTime(eventDateTime) // Ensure this is in ISO 8601 format, e.g., "2023-10-15T14:30:00Z"
            };

            try {
                const response = await fetch('http://localhost:8080/group/event/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // This is the key to include cookies
                    body: JSON.stringify(eventData),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                console.log("Event created successfully:");

                // Reset the fields after creating the event
                setEventTitle("");
                setEventDescription("");
                setEventDateTime("");
                setOptions([{ name: "", icon: <FaIcons.FaQuestionCircle /> }]); // Reset options
                closePopup();
            } catch (error) {
                console.error("Error creating event:", error);
            }
        } else {
            alert("Please fill in all fields.");
        }
    };

    const addOption = () => {
        if (options.length < 3) {
            setOptions([...options, { name: "", icon: <FaIcons.FaQuestionCircle /> }]);
            setIconPickerOpen([...isIconPickerOpen, false]);
        } else {
            alert("You can only add up to 3 options.");
        }
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
        setIconPickerOpen(isIconPickerOpen.filter((_, i) => i !== index));
    };

    const updateOptionName = (index: number, newName: string) => {
        const updatedOptions = [...options];
        updatedOptions[index].name = newName;
        setOptions(updatedOptions);
    };

    const updateOptionIcon = (index: number, newIcon: ReactElement) => {
        const updatedOptions = [...options];
        updatedOptions[index].icon = newIcon;
        setOptions(updatedOptions);
        toggleIconPicker(index, false); // Close the picker after selection
    };

    const toggleIconPicker = (index: number, open: boolean) => {
        const updatedIconPicker = [...isIconPickerOpen];
        updatedIconPicker[index] = open;
        setIconPickerOpen(updatedIconPicker);
    };

    // Function to render the icon picker
    const renderIconPicker = (index: number) => (
        <div className="icon-picker-scroll">
            {Object.keys(FaIcons).map((iconKey, i) => {
                const IconComponent = FaIcons[iconKey as keyof typeof FaIcons];
                return (
                    <span
                        key={i}
                        className="icon-picker-item"
                        onClick={() => updateOptionIcon(index, <IconComponent />)}
                    >
                        <IconComponent />
                    </span>
                );
            })}
            {Object.keys(MdIcons).map((iconKey, i) => {
                const IconComponent = MdIcons[iconKey as keyof typeof MdIcons];
                return (
                    <span
                        key={i}
                        className="icon-picker-item"
                        onClick={() => updateOptionIcon(index, <IconComponent />)}
                    >
                        <IconComponent />
                    </span>
                );
            })}
        </div>
    );

    const [profileData, setProfileData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchGroupData();
            console.log(data);
            if (data.Group.is_user_member == true) {
                setIsMember(true)
            } else {
                setIsMember(false)
            }
            console.log(data.Group.is_user_member)
            setProfileData(data);
        };

        getData();
    }, []);

    const [groupEvent, setGroupEvent] = useState([]);
    const [membersToInvite, setMembersToInvite] = useState([]);


    useEffect(() => {
        const getData = async () => {
            const data = await fetchEventData();
            console.log(data);
            setGroupEvent(data);
        };

        getData();
    }, []);


    useEffect(() => {
        const getData = async () => {
            const data = await fetchMembers();
            console.log(data);
            setMembersToInvite(data);
        };

        getData();
    }, []);

    // Filtered members based on the search term
    const filteredMembers = membersToInvite.filter(member =>
        member.username && member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );


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
                    {profileData.Group &&
                        <div className="profile-details">
                            <h1 className="profile-name">{profileData.Group.title}</h1>
                            <p className="profile-desc">
                                {profileData.Group.description}                        </p>
                            <div className="profile-follow-info">
                                {profileData.Members &&

                                    <span>{profileData.Members ? profileData.Members.length : 0} Member</span>}
                            </div>
                        </div>
                    }
                </div>
                {profileData && isMember && (
                    <div className="button-container">
                        <button className="expandable-button button-1" onClick={() => setIsPostPopupOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon" style={{ color: '#f35366' }} />
                            <span>Create Post</span>
                        </button>

                        <button className="expandable-button button-2" onClick={openPopup} >
                            <FontAwesomeIcon icon={faCalendarDays} className="icon" style={{ color: '#4CAF50' }} />
                            <span style={{ color: '#4CAF50' }}>Create Event</span>
                        </button>

                        <button className="expandable-button button-3" onClick={toggleList}>
                            <FontAwesomeIcon icon={faUser} className="icon" style={{ color: ' #2196F3' }} />
                            <span style={{ color: ' #2196F3' }}>Invite Member</span>
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
                {activeTab === 'Events' && profileData.Group && profileData.Group.is_user_member && groupEvent && (
                    <div className="events-section">
                        <div className="group-card-container">
                            {groupEvent.map((group) => (
                                <div key={group.id} className="group-card">
                                    <img src={profileData.Group.image_url} alt={profileData.Group.image_url} className="group-image" />

                                    <div className="group-details">
                                        <div className="event-icons">
                                            <span className="icon-check">✔️</span>
                                            <span className="icon-heart">❤️</span>
                                            <span className="icon-cross">❌</span>
                                        </div>

                                        <p className="group-date"><i className="icon-calendar"></i> {group.created_at}</p>
                                        <h3 className="eventTitle">{group.title}</h3>
                                        <p className="group-location">{group.description
                                        }</p>

                                        {/* Display images of friends, showing only the first three and a + if there are more */}
                                        {/* <p className="group-friends">
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
                                        </p> */}
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
                                gridTemplateColumns: "repeat(2, minmax(380px, 1fr))", // Auto-adjust columns
                                gap: "30px", // Space between posts
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {profileData.Posts && profileData.Posts.map((post, index) => (
                                <Post index={post.groupName} post={post} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Members' && profileData.Members && (
                    <div className="members-section">
                        <ul className="member-list">
                            {profileData.Members.map((member) => (
                                <li key={member.id} className="member-item">
                                    <img src={member.image_url} alt={member.username} className="member-image" />
                                    <div className="member-details">
                                        <h3 className="member-name">{member.username}</h3>
                                        <p className="member-username">{member.nickname}</p> {/* Username added here */}
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

            {/* Expandable div */}
            {isOpen && profileData.Group.is_user_member && (
                <div className="popup">
                    <div className="popup-header">
                        <h3>Members</h3>
                        <button className="close-button" onClick={closeList}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Add members by name or email"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Member List */}
                    <div className="member-list">
                        {filteredMembers.map((member, index) => (
                            <div className="member" key={index}>
                                <img src="https://picsum.photos/40/40?random=19" alt={member.nickname} className="member-avatar" />
                                <div className="member-info">
                                    <p className='memberName'>{member.nickname}</p>
                                    <p>{member.username}</p>
                                    <button className="invite" onClick={() => sendInvite(member.id)}>Invite</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {/* Expandable div for Create Post Popup */}
            {isPostPopupOpen && profileData.Group.is_user_member && (
                <div className="popup">
                    <div className="popup-header">
                        <h3>Create a Post</h3>
                        <button className="close-button" onClick={closePopup}>
                            X
                        </button>
                    </div>

                    {/* Image Upload */}
                    <label htmlFor="imageUpload" className="image-upload-label">
                        {postImage ? (
                            <img src={postImage} alt="Uploaded Preview" className="uploaded-image" />
                        ) : (
                            <div className="upload-placeholder">
                                <p>Upload an Image</p>
                            </div>
                        )}
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    {/* Description Input */}
                    <textarea
                        placeholder="Write a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="description-input"
                    />

                    {/* Create Post Button */}
                    <button className="create-post-button" onClick={handlePostCreation}>
                        Create Post
                    </button>
                </div>
            )}

            {isPopupOpen && profileData.Group.is_user_member && (
                <>
                    <div className="overlay" onClick={closePopup}></div>
                    <div className="popup">
                        <div className="popup-header">
                            <h3>Create Event</h3>
                            <button className="close-button" onClick={closePopup}>×</button>
                        </div>
                        <div className="form-field">
                            <label htmlFor="event-title">Event Title</label>
                            <input
                                type="text"
                                id="event-title"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Enter event title"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="event-description">Event Description</label>
                            <textarea
                                id="event-description"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                                placeholder="Enter event description"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="event-datetime">Event Date and Time</label>
                            <input
                                type="datetime-local"
                                id="event-datetime"
                                value={eventDateTime}
                                onChange={(e) => setEventDateTime(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label>Options </label>
                            <button className="add-option-button" onClick={addOption} disabled={options.length >= 3}>
                                <span className="add-option-icon">+</span> New Option
                            </button>
                            {options.map((option, index) => (
                                <div key={index} className="option-field">
                                    <input
                                        type="text"
                                        placeholder="Option Name"
                                        value={option.name}
                                        onChange={(e) => updateOptionName(index, e.target.value)}
                                    />
                                    <div className="icon-input" onClick={() => toggleIconPicker(index, !isIconPickerOpen[index])}>
                                        {option.icon}
                                    </div>

                                    {isIconPickerOpen[index] && (
                                        <div className="icon-picker-wrapper">
                                            {renderIconPicker(index)}
                                        </div>
                                    )}

                                    <button
                                        className="remove-button"
                                        onClick={() => removeOption(index)}
                                        disabled={options.length < 2}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button className="create-post-button" onClick={handleCreateEvent}>
                            Create Event
                        </button>
                    </div>
                </>
            )}


            {/* Embedded CSS */}
            <style jsx>{`
            /* Container Styles */


            .invite {
    float: right;
    background-color: #f35366;
    color: white;
}

.group-post {
    min-width: 900px;
    margin-left: 40px;
    left: 40px;
    position: absolute;
}

.memberName {
    font-size: 1.2rem;
    font-weight: bold;
}

.profile-info {
    display: flex;
    width: 100%;
}

.group-page-container {
    width: 95%;
    margin-left: 2.5%;
    font-family: Arial, sans-serif;
    height: 100%;
    /* Ensure full height stretch */
}

.profile-header {
    min-width: 1000px;
    /* Ensure full width */
    position: relative;
    /* Ensure the button container is positioned relative to this */
    height: 300px;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 20px;
    border-radius: 15px;
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    /* Stretch to full width */
}

.profile-avatar {
    margin: auto;
    margin-left: 40px;
    width: 255px;
    height: 210px;
    /* Adjust to keep it proportional */
    border-radius: 200px;
    border: 2px solid #e0e0e0;
}

.profile-details {
    margin-left: 40px;
    flex-grow: 1;
    /* Allows profile details to stretch */
    width: 100%;
    /* Ensures it fills available width */
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
    min-width: 1000px;
    /* Ensure full width */
    margin-top: 20px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    /* Aligns the entire list horizontally */
    align-items: center;
    /* Centers the items vertically */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    /* Stretches to full width */
}

.list-bar ul {
    height: 60px;
    margin: 10px;
    list-style: none;
    display: flex;
    justify-content: space-between;
    /* Adds space between the list items */
    width: 100%;
    /* Stretches to full width */
    padding: 0;
    gap: 10px;
    /* Adds space between the li elements */
}

.list-bar li {
    display: flex;
    justify-content: center;
    /* Center text horizontally */
    align-items: center;
    /* Center text vertically */
    font-size: 20px;
    cursor: pointer;
    padding: 10px 20px;
    margin-bottom: 0;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    flex-grow: 1;
    /* Ensures each li stretches evenly across the width */
    text-align: center;
    /* Center the text */
    width: 100%;
    /* Ensure li takes full width */
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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    /* Flexible grid */
    margin-top: 20px;
    gap: 20px;
    /* Space between grid items */
    border-radius: 20px;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
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
    min-height: 150px;
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

.icon-check,
.icon-heart,
.icon-cross {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* Shadow effect */
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    padding: 10px;
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.icon-check:hover,
.icon-heart:hover,
.icon-cross:hover {
    transform: scale(1.2);
}

.group-date {
    margin-top: 25px;
    font-size: 14px;
    color: #888;
    margin-bottom: 20px;
}

.group-location,
.group-attendees,
.group-friends {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
}

.icon-calendar,
.icon-friends {
    margin-right: 5px;
}

.group-friends {
    position: absolute;
    bottom: 10px;
    display: flex;
    /* Makes the content inline */
    align-items: center;
    /* Aligns text and images vertically */
    font-size: 14px;
    /* Adjust font size as needed */
    color: #888;
    /* Text color */
}

.friends-images {
    display: flex;
    /* Arrange images in a row */
    margin-right: 5px;
    /* Space between images and text */
}

.friend-image {
    width: 30px;
    /* Adjust as needed */
    height: 30px;
    /* Adjust as needed */
    border-radius: 50%;
    /* Makes the image circular */
    margin-top: -10px;
    /* Overlap images */
    margin-left: 5px;
    /* Space between images */
    position: relative;
    /* Required for absolute positioning */
}

.eventTitle {
    font-size: auto;
}

.frindsText {
    float: left;
    margin-left: 5px;
}

.members-section {
    padding: 20px 30px;
    /* Increased padding */
}

.member-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow-y: scroll;
    max-height: 600px;
}

.member-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    /* Increased padding between items */
    border-bottom: 1px solid #e0e0e0;
}

.member-image {
    width: 70px;
    /* Increased image size */
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
    /* Increased spacing between image and text */
}

.member-details {
    display: flex;
    flex-direction: column;
}

.member-name {
    font-size: 20px;
    /* Increased font size for name */
    font-weight: 700;
    /* Bolder font for name */
    margin: 0;
    color: #333;
}

.member-username {
    font-size: 16px;
    /* Increased font size for username */
    color: #666;
    /* Slightly darker color */
    margin: 6px 0 0 0;
}

.popup {
    border: 1px solid #ddd;
    padding: 20px;
    max-width: 1000px;
    min-width: 500px;
    width: 60%;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    min-height: 600px;
    z-index: 100;
    height: auto;
    max-height: 900px;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-bottom: 20px;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}

.search-bar {
    margin-bottom: 25px;
}

.search-bar input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.member {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f1f1;
    position: relative;
}

.member-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 10px;
    margin-top: 0px;
}

.member-info {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 5px;
    margin-left: 10px;
    line-height: 1;
}


/* Invite button positioned absolutely to the right */

.invite {
    background-color: #2196f3;
    color: white;
    width: 90px;
    height: 40px;
    border: none;
    padding: 8px 16px;
    border-radius: 200px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
}

.invite:hover {
    background-color: Grey;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}

.image-upload-label {
    display: block;
    margin-bottom: 15px;
    cursor: pointer;
}

.upload-placeholder {
    border: 1px dashed #ccc;
    padding: 20px;
    text-align: center;
    background-color: #f9f9f9;
}

.uploaded-image {
    max-width: 6000px;
    width: 100%;
    min-width: 350px;
    margin-bottom: 15px;
    max-height: 300px;
    object-fit: cover;
}

.description-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
    height: 100px;
    resize: none;
}

.create-post-button {
    background-color: #2196f3;
    color: white;
    width: 150px;
    height: 40px;
    border: none;
    border-radius: 200px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;
    position: relative;
    left: 42.5%;
    top: 90%;
    max-width: 1200px;
    margin-top: 50px;
}

.create-post-button:hover {
    background-color: #989898;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

.form-field {
    margin-top: 15px;
}

.form-field label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-field input,
.form-field textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
}

.form-field textarea {
    max-height: 200px;
    min-height: 40px;
    overflow: hidden;
}

.icon-input input {
    border: none;
    flex-grow: 1;
    background: transparent;
    outline: none;
    font-size: 14px;
}

.icon-picker {
    position: absolute;
    top: 100%;
    left: 0;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    z-index: 102;
    display: none;
}

.icon-picker.active {
    display: block;
}

.icon-picker-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.icon-picker-header button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #6200ea;
}

.icon-picker-content {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
    padding: 10px;
}

.icon-picker-item {
    font-size: 20px;
    cursor: pointer;
}

.option-field {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
    margin-top: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.option-field input {
    flex-grow: 1;
    border: none;
    padding: 6px;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
    outline: none;
    /* Prevents outline on focus */
}


/* Styles for the input when it is focused or clicked */

.option-field input:focus {
    border: none;
    /* No border */
    box-shadow: none;
    /* No shadow (if any is applied by default) */
    background: #fff;
    /* Keep the background the same */
}

.remove-button {
    background: none;
    border: none;
    color: #ff5c5c;
    font-size: 20px;
    cursor: pointer;
}

.icon-input {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
}

.icon-picker-toggle {
    background: none;
    border: none;
    font-size: 12px;
    cursor: pointer;
}

.icon-picker-wrapper {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    margin-top: 270px;
    width: 43.5%;
    left: 53.5%;
}

.icon-picker-wrapper::-webkit-scrollbar {
    width: 6px;
    /* Make the scrollbar thinner */
}

.icon-picker-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* Light grey background for the scrollbar track */
    border-radius: 10px;
}

.icon-picker-wrapper::-webkit-scrollbar-thumb {
    background-color: #bbb;
    /* Slightly darker grey for the scrollbar thumb */
    border-radius: 10px;
    /* Rounded edges for a smoother look */
}

.icon-picker-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #888;
    /* Darken the thumb when hovering for better visibility */
}

.icon-picker-item {
    display: inline-block;
    padding: 5px;
    cursor: pointer;
    font-size: 20px;
}

.remove-button {
    background: none;
    border: none;
    font-size: 18px;
    color: #ff5c5c;
    cursor: pointer;
}

.add-option-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background-color: #f2f2f2;
    border: 1px dashed #ddd;
    border-radius: 4px;
    color: #333;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
}

.add-option-button:disabled {
    color: #aaa;
    cursor: not-allowed;
}

.add-option-icon {
    font-size: 16px;
    color: #333;
}

.add-option-button:hover:not(:disabled) {
    background-color: #f0f0f0;
}

.remove-button:disabled {
    color: #aaa;
    cursor: not-allowed;
}
    
            .button-container {
                position: absolute;
                /* Position it absolutely within the profile-header */
                z-index: 100;
                float: right;
                right: 30px;
                top: 30px;
                display: flex;
                gap: 15px;
                /* Space between buttons */
                height: 40px;
            }

            .expandable-button {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                border: 2px solid #f35366;
                /* Default border */
                border-radius: 50px;
                padding: 0 15px;
                height: 50px;
                width: 50px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                color: #f35366;
                /* Default text color */
                transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease, padding 0.4s ease;
                /* Smoother transition for width */
                white-space: nowrap;
                overflow: hidden;
                position: relative;
            }


            /* Icon styles: initially centered */

            .expandable-button .icon {
                position: absolute;
                transform: translateX(-50%);
                /* Center the icon in the circle */
                transition: left 0.9s ease, transform 0.4s ease;
            }


            /* Hover effect */

            .expandable-button:hover {
                width: auto;
                /* Expand width on hover */
                justify-content: flex-start;
                /* Align items to the left when expanded */
                transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                /* Smoother width transition */
            }


            /* Move the icon to the left of the text on hover */

            .expandable-button:hover .icon {
                /* Move the icon to the left inside the expanded button */
                transform: translateX(0);
                /* No more centering */
            }


            /* Initially hide the text */

            .expandable-button span {
                margin-left: 5px;
                /* Reduce space between icon and text */
                display: none;
            }


            /* Show the text on hover */

            .expandable-button:hover span {
                display: inline;
            }


            /* Different colors for each button border and icon */

            .button-1 {
                border-color: #f35366;
                /* Red for Add Post */
            }

            .button-2 {
                border-color: #4caf50;
                /* Green for Add Event */
            }

            .button-3 {
                border-color: #2196f3;
                /* Blue for Invite Member */
            }


            `}</style>
        </div >
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
        group: {
            title: "hello",
        },
        author: {
            nickname: "hello",
        },
        username: "Jonathan",
        userImage: "https://picsum.photos/200/300?random=2",
        time: "Just Now",
        content: "Hi guys, today I’m bringing you a UI design for Logistic Website.",
        postImage: "https://picsum.photos/200/300?random=3",
    },
    {
        groupName: "Code Newbie",
        group: {
            title: "hello",
        },
        author: {
            nickname: "hello",
        },
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
        group: {
            title: "hello",
        },
        author: {
            nickname: "hello",
        },
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
