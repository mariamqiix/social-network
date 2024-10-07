'use client'; // Add this line at the very top to mark the component as a Client Component
import React, { useState } from 'react';
import Post from '../../components/GroupPostContent'; // Adjust the path if necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPlus, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import "./groupPage.css";

import * as FaIcons from 'react-icons/fa'; // Import all FontAwesome icons
import * as MdIcons from 'react-icons/md'; // Import all Material Design icons
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

    // State to track if the list is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // State to handle search input
    const [searchTerm, setSearchTerm] = useState('');

    // Members data
    const membersToInvite = [
        { name: 'Frankie Sullivan', email: 'frankie@untitledui.com', role: 'Owner', status: 'You' },
        { name: 'Amélie Laurent', email: 'amelie@untitledui.com', role: 'Editor' },
        { name: 'Katie Moss', email: 'katie@untitledui.com', role: 'Editor', status: 'Invite pending' },
    ];

    // Function to toggle the list
    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    // Function to close the list
    const closeList = () => {
        setIsOpen(false);
    };

    // Filtered members based on the search term
    const filteredMembers = membersToInvite.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            setPostImage(URL.createObjectURL(file));
        }
    };

    // Function to handle post creation
    const handlePostCreation = () => {
        if (description || postImage) {
            // Here you would typically send the postData to your backend or state management
            console.log("Post created:", { description, image: postImage });
            closePopup();
        } else {
            alert("Please add a description or image before posting.");
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



    const getIconComponent = (iconDisplayName) => {
        if (!iconDisplayName || typeof iconDisplayName !== 'string') {
            console.error('Icon display name is not provided or is invalid');
            return null; // Return null if iconDisplayName is not valid
        }

        // Capitalize the first letter and ensure "Fa" prefix
        const iconKey = `${iconDisplayName.charAt(0).toUpperCase() + iconDisplayName.slice(1)}`;
        const IconComponent = FaIcons[iconKey];

        if (!IconComponent) {
            console.error(`Icon "${iconDisplayName}" not found in react-icons/fa. Constructed Key: ${iconKey}`);
            return null; // Return null if the icon doesn't exist
        }

        return <IconComponent />;
    };

    const handleCreateEvent = () => {
        if (eventTitle && eventDescription && eventDateTime) {
            const eventOptions = options.map(option => ({
                name: option.name,
                icon: option.icon.type.displayName || option.icon.type.name // Convert icon to string representation

            }));

            console.log("Event Created: ");
            console.log("Title: ", eventTitle);
            console.log("Description: ", eventDescription);
            console.log("Date and Time: ", eventDateTime);
            console.log("Options: ", eventOptions);
            console.log(getIconComponent(eventOptions[0].icon));

            // Reset the fields after creating the event
            setEventTitle("");
            setEventDescription("");
            setEventDateTime("");
            setOptions([{ name: "", icon: <FaIcons.FaQuestionCircle /> }]); // Reset options
            closePopup();
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

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
        setIconPickerOpen(isIconPickerOpen.filter((_, i) => i !== index));
    };

    const updateOptionName = (index, newName) => {
        const updatedOptions = [...options];
        updatedOptions[index].name = newName;
        setOptions(updatedOptions);
    };

    const updateOptionIcon = (index, newIcon) => {
        const updatedOptions = [...options];
        updatedOptions[index].icon = newIcon;
        setOptions(updatedOptions);
        toggleIconPicker(index, false); // Close the picker after selection
    };

    const toggleIconPicker = (index, open) => {
        const updatedIconPicker = [...isIconPickerOpen];
        updatedIconPicker[index] = open;
        setIconPickerOpen(updatedIconPicker);
    };

    const renderIconPicker = (index) => (
        <div className="icon-picker-scroll">
            {Object.keys(FaIcons).map((iconKey, i) => {
                const IconComponent = FaIcons[iconKey];
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
                const IconComponent = MdIcons[iconKey];
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
                                gridTemplateColumns: "repeat(2, minmax(380px, 1fr))", // Auto-adjust columns
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

            {/* Expandable div */}
            {isOpen && (
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
                                <img src="https://picsum.photos/40/40?random=19" alt={member.name} className="member-avatar" />
                                <div className="member-info">
                                    <p className='memberName'>{member.name}</p>
                                    <p>{member.email}</p>
                                    <button className="invite">Invite</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {/* Expandable div for Create Post Popup */}
            {isPostPopupOpen && (
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

            {isPopupOpen && (
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
