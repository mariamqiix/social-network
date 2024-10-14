"use client";
import "../../../public/groupsPage.css";
import { GroupEventResponse, GroupsHomePageView } from '../types/Types';
import Post from "../components/GroupPostContent";
import React, { useRef, useState, useEffect } from 'react';
import { randomColor } from "../components/colors";
import * as FaIcons from "react-icons/fa"; // Import all FontAwesome icons
import { IconType } from 'react-icons'; // Import IconType from react-icons
import internal from "stream";

export const getIconComponent = (iconDisplayName: string): JSX.Element | null => {
    if (!iconDisplayName || typeof iconDisplayName !== 'string') {
        console.error('Icon display name is not provided or is invalid');
        return null; // Return null if iconDisplayName is not valid
    }

    // Ensure the icon name starts with "Fa" and capitalize the first letter
    const iconKey = `${iconDisplayName.charAt(0).toUpperCase() + iconDisplayName.slice(1)}` as keyof typeof FaIcons;
    const IconComponent: IconType | undefined = FaIcons[iconKey];

    if (!IconComponent) {
        console.error(`Icon "${iconDisplayName}" not found in react-icons/fa. Constructed Key: ${iconKey}`);
        return null; // Return null if the icon doesn't exist
    }

    return <IconComponent />;
};
export default function Page() {

    // State for the Create Group popup
    const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false);
    const [groupTitle, setGroupTitle] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupImage, setGroupImage] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Function to handle image upload for group creation
    const handleGroupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGroupImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    // Function to handle group creation
    const handleGroupCreation = async () => {
        // Ensure both title and description are provided
        if (groupTitle && groupDescription) {
            const groupData = {
                title: groupTitle,
                description: groupDescription,
                image: groupImage ? groupImage.split(',')[1] : null, // Only the base64 part of the image
            };

            try {
                const response = await fetch('http://localhost:8080/group/createGroup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies for session management
                    body: JSON.stringify(groupData),
                });

                // Check if the response is successful
                if (!response.ok) {
                    throw new Error(`Error: status code ${response.status}`);
                }
                console.log('Group created successfully:');

                // Close the popup after successful creation
                closeCreateGroupPopup();
                // Optionally reset fields
                setGroupTitle('');
                setGroupDescription('');
                setGroupImage(null);
                // Focus the button
                if (buttonRef.current) {
                    buttonRef.current.focus();
                }
            } catch (error) {
                console.error('Error creating group:', error);
                alert('Failed to create group. Please try again.');
            }
        } else {
            alert('Please provide both a title and a description for the group.');
        }
    };

    // Function to close the Create Group popup
    const closeCreateGroupPopup = () => {
        setIsCreateGroupPopupOpen(false);
        // Reset state variables if needed
        setGroupTitle('');
        setGroupDescription('');
        setGroupImage(null);
    };


    const [groupData, setGroupData] = useState<GroupsHomePageView>(
        {
            User: null,
            Posts: [],
            Groups: []
        }
    );
    const [groupEvent, setGroupEvent] = useState<GroupEventResponse[]>([]);

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
            const data = await fetchGroupData('http://localhost:8080/group/list/all');
            console.log(data);

            setGroupData(data);
        };

        getData();
    }, []);

    const reloadGroups = async (url: string) => {
        const data = await fetchGroupData(url);
        setGroupData(prevState => ({
            ...prevState,
            Groups: data.Groups // Directly replacing the existing groups with the new ones
        }));
    };

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
        <div
            id="groups"
            style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                minHeight: "980px",
                overflowX: "hidden",
                backgroundColor: "#f0f4f7", // Light background
            }}
        >
            <div className="tabs">

                <div className="tab-group-left">
                    <button className="tab-button" autoFocus onClick={() => reloadGroups('http://localhost:8080/group/list/all')} ref={buttonRef}>All</button>
                    {groupData.User && (
                        <>
                            <button className="tab-button" onClick={() => reloadGroups('http://localhost:8080/group/list/joind')}>Joined</button>
                            <button className="tab-button" onClick={() => reloadGroups('http://localhost:8080/group/list/created')}>Created</button>
                            <button className="tab-button" onClick={() => reloadGroups('http://localhost:8080/group/list/requested')}>Requested To Join</button>
                        </>
                    )}

                </div>
                <div className="tab-group-right">
                    {groupData.User && (
                        <>
                            <button className="tab-button" onClick={() => setIsCreateGroupPopupOpen(true)}>Create New Group</button>
                        </>
                    )}
                </div>
            </div>

            <div
                className="group-card-container"

            >
                {groupData.Groups && groupData.Groups.map((group, index) => (

                    <div
                        onClick={() => window.location.href = `./groups/groupPage?id=${group.id}`}
                        key={`group${index}`}
                        style={{
                            minWidth: "450px",
                            padding: "15px",
                            backgroundColor: randomColor(), // Set the background color to a random color
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "30px",
                            position: "relative", // For absolute positioning of the hidden div
                            transition: "transform 0.3s ease-in-out",
                        }}
                        className="group-card"
                    >
                        <div
                            style={{
                                transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
                            }}
                            className="group-blur"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <img src={`data:image/jpeg;base64,${group.image_url}`} alt={group.title}
                                    style={{
                                        marginLeft: "20px",
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                    }}
                                />
                                <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "1.1rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {group.title}
                                    </h3>
                                    <span
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "#888",
                                        }}
                                    >
                                        {/* Limit description to 15 characters with ellipsis if needed */}
                                        {group.description.length > 15
                                            ? group.description.slice(0, 15) + "..."
                                            : group.description}{" "}
                                    </span>
                                    <br />
                                    <span
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "#888",
                                        }}
                                    >
                                        {group.created_at}
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "10%",
                                    marginLeft: "10px",
                                    color: "#6e6e6e",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {group.group_member} contacts
                            </div>
                        </div>

                        {/* Full description div, initially hidden */}
                        <div className="full-description">{group.description}</div>
                    </div>



                ))}
                {!(groupData.Groups) && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%', // Full height of the container
                        width: '100%',  // Full width of the container
                    }}>
                        <span style={{
                            fontSize: '1.5rem',
                            color: '#888',
                        }}>No groups</span>
                    </div>
                )}

            </div>

            <div className="event-card-container">
                {groupEvent && groupEvent.map((group) => (
                    <div key={`${group.id}Events`} className="event-card">
                        <img src={`data:image/jpeg;base64,${group.group.image_url}`} alt={group.group.title} className="group-image" />

                        <div className="group-details">
                            <div className="event-icons">
                                {group.options && group.options.map((option, index) => (
                                    <span
                                        key={`event${index}`}
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

                            <p className="group-date"><i className="icon-calendar"></i> {group.event_time}</p>
                            <h3 className="eventTitle">{group.title}</h3>
                            <p className="group-location">{group.description}</p>

                            {/* Display images of friends, showing only the first three and a + if there are more */}
                            <p className="group-friends">
                                {group.options && (
                                    <>
                                        <i className="icon-friends"></i>
                                        {group.options[0].users_response.slice(0, 3).map((friend, index) => (
                                            <img key={`event${group.id}frind${index}`} src={`data:image/jpeg;base64,${friend.image_url}`} alt={`Friend ${index + 1}`} className="friend-image" />
                                        ))}
                                        {group.options[0].users_response.length > 3 ? (
                                            <span className="friendsText">   + {group.options[0].users_response.length - 3} friends are going</span>
                                        ) : (
                                            <span className="friendsText">  {group.options[0].users_response.length} friends are going</span>
                                        )}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
                {!(groupEvent) && (
                    <span style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%', // Adjust height as needed
                    }}>no events</span>
                )}
            </div>
            <div
                id="group-post"
                style={{
                    marginTop: "2.5%",
                    marginLeft: "2.5%",
                    width: "95%",
                    display: "grid", // Use CSS Grid
                    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", // Auto-adjust columns
                    gap: "30px", // Space between posts
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f4f7",
                    minHeight: "400px",
                    maxHeight:"400px",
                }}
            >
                {groupData.Posts && groupData.Posts.map((post, index) => (
                    <Post post={post} />
                ))}
            </div>

            {/* Expandable div for Create Group Popup */ }
    {
        isCreateGroupPopupOpen && (
            <div className="popup">
                <div className="popup-header">
                    <h3>Create a Group</h3>
                    <button className="close-button" onClick={closeCreateGroupPopup}>
                        X
                    </button>
                </div>


                {/* Image Upload */}
                <label htmlFor="groupImageUpload" className="image-upload-label">
                    {groupImage ? (
                        <img src={groupImage} alt="Uploaded Group Image Preview" className="uploaded-image" />
                    ) : (
                        <div className="upload-placeholder">
                            <p>Upload Group Image</p>
                        </div>
                    )}
                </label>


                {/* Group Title Input */}
                <input
                    type="text"
                    placeholder="Enter group title"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    className="title-input"
                />
                <input
                    type="file"
                    id="groupImageUpload"
                    accept="image/*"
                    onChange={handleGroupImageUpload}
                    style={{ display: 'none' }}
                />

                {/* Group Description Input */}
                <textarea
                    placeholder="Write a group description..."
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="description-input"
                />

                {/* Create Group Button */}
                <button className="create-group-button" onClick={handleGroupCreation}>
                    Create Group
                </button>
            </div>
        )
    }


        </div >
    );
}


export async function fetchGroupData(url: string): Promise<GroupsHomePageView> {
    try {
        console.log("hello\n\n");
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData: GroupsHomePageView = await response.json();
        console.log(groupData);
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return a default GroupsHomePageView object
        return {
            User: null,
            Posts: [],
            Groups: []
        };
    }
}

export async function fetchEventData(): Promise<GroupEventResponse[]> {
    const url = 'http://localhost:8080/group/event/list/user';

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData: GroupEventResponse[] = await response.json();
        console.log(groupData);
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}