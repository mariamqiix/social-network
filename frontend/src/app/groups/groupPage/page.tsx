'use client'; // Add this line at the very top to mark the component as a Client Component
import { User } from "../../types/Types";
import "../../../../public/groupPage.css";
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import Post from '../../components/GroupPostContent';
import React, { useState, ReactElement, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GroupPageView, GroupEventResponse } from "../../types/Types";
import { faCalendarDays, faPlus, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RequestToJoin, sendInvite, fetchEventData, fetchMembers, fetchGroupData, LeaveGroup } from "./fetching";
import { randomColor } from "@/app/components/colors";

const query = new URLSearchParams(window.location.search);
const id = query.get('id') || ''; // Get the 'id' from the query string and ensure it's a string

const GroupPage = () => {
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


                const [groupEvent, setGroupEvent] = useState<GroupEventResponse[]>([]);

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


    const [profileData, setProfileData] = useState<GroupPageView>({
        user: null,
        Posts: [],
        Group: {
            id: 0,
            creator: {
                id: 0,
                username: '',
                nickname: '',
                email: '',
                firstName: '',
                lastName: '',
                dob: '',
                bio: '',
                image_url: ''
            },
            title: '',
            description: '',
            image_url: '',
            is_user_member: false,
            created_at: '',
            group_member: 0
        },
        Members: []
    });

    const [isMember, setIsMember] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const toggleList = () => {
        setIsOpen(!isOpen);
    };
    const closeList = () => {
        setIsOpen(false);
    };
    const [postImage, setPostImage] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isPostPopupOpen, setIsPostPopupOpen] = useState<boolean>(false);
    const closePopup = () => {
        setPopupOpen(false);
        setIsPostPopupOpen(false);
        setPostImage(null); // Reset image when closing
        setDescription('');  // Reset description when closing
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


    useEffect(() => {
        const getData = async () => {
            const data = await fetchGroupData();
            console.log(data);
            if (data.Group.is_user_member == true) {
                setIsMember(true)
            } else {
                setIsMember(false)
            }
            setProfileData(data);
        };

        getData();
    }, []);

    const [groupEvent, setGroupEvent] = useState<GroupEventResponse[]>([]);
    const [membersToInvite, setMembersToInvite] = useState<User[]>([]);


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

    const filteredMembers = membersToInvite.filter(member =>
        typeof member.username === 'string' && member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [activeTab, setActiveTab] = useState('Posts');


    const getIconStyle = (didUserRespond: boolean) => {
        return didUserRespond ? { backgroundColor: randomColor() } : {}; // Random color if user responded
    };


    const handleReact = async (option_id: number, event_id: number) => {
        try {
            const response = await fetch('http://localhost:8080/group/event/userResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ event_id, option_id }), // Send the ID of the option being reacted to
            });

            if (!response.ok) {
                throw new Error(`Error: status code ${response.status}`);
            }

            // Optionally, update the UI state here to reflect the user's reaction
            console.log('User reacted to option:', option_id);
        } catch (error) {
            console.error('Error sending reaction:', error);
        }
    };

    return (
        <div className="GroupPageContainer">
            {/* Profile Header */}
            <div className="GroupProfilePageHeader">
                <div className="profile-info">
                    <img
                        src={`data:image/jpeg;base64,${profileData.Group.image_url}`}
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
                                <Post post={post} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Members' && profileData.Members && (
                    <div className="members-section">
                        <ul className="member-list">
                            {profileData.Members.map((member) => (
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
                                <img src={`data:image/jpeg;base64,${member.image_url}`} alt={member.nickname} className="member-avatar" />
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
            .button-container {
                position: absolute;
                /* Position it absolutely within the GroupProfilePageHeader */
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



export const getIconComponent = (iconDisplayName: string) => {
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