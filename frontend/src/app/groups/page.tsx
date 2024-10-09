"use client";
import "../../../public/groupsPage.css";
import { GroupEventResponse, GroupsHomePageView } from '../types/Types';
import Post from "../components/GroupPostContent";
import React, { useState, useEffect } from 'react';
import { randomColor } from "../components/colors";



export default function Page() {
    const [groupData, setGroupData] = useState<GroupsHomePageView>(
        {
            user: null,
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
                    <button className="tab-button" autoFocus onClick={() => reloadGroups('http://localhost:8080/group/list/all')}>All</button>
                    <button className="tab-button" onClick={() => reloadGroups('http://localhost:8080/group/list/joind')} >Joined</button>
                    <button className="tab-button" onClick={() => reloadGroups('http://localhost:8080/group/list/created')}>created</button>
                    <button className="tab-button" onClick={() => reloadGroups('http://localhost:8080/group/list/requested')}>Requested To Join</button>

                </div>
                <div className="tab-group-right">
                    <button className="tab-button">Create New Group</button>
                </div>
            </div>

            <div
                className="group-card-container"

            >
                {groupData.Groups && groupData.Groups.map((group, index) => (

                    <div
                        onClick={() => window.location.href = `./groups/groupPage?id=${group.id}`}
                        key={index}
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
                                <img
                                    src={group.image_url}
                                    alt={group.title}
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
                                {group.id} contacts
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
                    <div key={group.group.id} className="event-card">
                        <img src={group.group.image_url} alt={group.group.title} className="group-image" />

                        <div className="group-details">
                            <div className="event-icons">
                                <span className="icon-check">✔️</span>
                                <span className="icon-heart">❤️</span>
                                <span className="icon-cross">❌</span>
                            </div>

                            <p className="group-date"><i className="icon-calendar"></i> {group.event_time}</p>
                            <h3 className="eventTitle">{group.title}</h3>
                            <p className="group-location">{group.description}</p>

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
                }}
            >
                {groupData.Posts && groupData.Posts.map((post, index) => (
                    <Post index={post.group} post={post} />
                ))}
            </div>
        </div>
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
            user: null,
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
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}