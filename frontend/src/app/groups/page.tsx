"use client";
import React, { useState, useEffect } from 'react';

import Post from "../components/GroupPostContent"; // Adjust the path if necessary
import { randomColor } from "../components/colors";
export default function Page() {

    const [groupData, setGroupData] = useState([]);
    const [groupEvent, setGroupEvent] = useState([]);

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
            const data = await fetchGroupData();
            console.log(data);

            setGroupData(data);
        };

        getData();
    }, []);

    console.log("\n\n\n", groupEvent);
    return (
        <div
            id="groups"
            style={{
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                minHeight: "980px",
                overflowX: "hidden",
                backgroundColor: "#f0f4f7", // Light background
            }}
        >
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
                                    src={group.image}
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
                                        {group.date}
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
                    <Post index={post.groupName} post={post} />
                ))}
            </div>
            <style jsx>{`

                .group-card-container {
                        width: 95%; /* Set initial width to 95% */
                        margin-left: 2.5%;
                        margin-top: 20px;
                        display: flex;
                        overflow-x: scroll;
                        gap: 20px;
                        min-height: 190px;
                        padding: 20px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        background-color: white;
                        border-radius: 20px;
                    }

            .event-card-container {
                            min-height: 250px;
                display: flex;
                width:95%;
                margin-left: 2.5%;
                margin-top: 15px;
                overflow-x: scroll;
                gap: 20px;
                height:auto;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                background-color: white;
                border-radius: 20px;
            }

            .event-card {
                background: #fff;
                border-radius: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                min-width: 310px;
                position: relative;
                height: 410px;
                padding-bottom: 15px;
            }

            .event-card:hover {
                transform: translateY(-5px);
            }

            .group-image {
                width: 100%;
                min-height: 150px;
                position:relative;
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

            `}</style>
        </div>
    );
}


async function fetchGroupData() {
    const url = 'http://localhost:8080/group/list/all';

    try {
        console.log("hello\n\n")
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData = await response.json();
        console.log(groupData)
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}

async function fetchEventData() {
    const url = 'http://localhost:8080/group/event/list/user';

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
