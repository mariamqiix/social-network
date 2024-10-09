"use client";
import Post from "../components/GroupPostContent"; // Adjust the path if necessary
import { randomColor } from "../components/colors";
export default function Page() {

    return (
        <div
            id="groups"
            style={{
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                overflowX: "hidden",
                backgroundColor: "#f0f4f7", // Light background
            }}
        >
        <div
                className="group-card-container"

            >
                {groupData.map((group, index) => (
                                            
                    <div
                        onClick={() => window.location.href = './groups/groupPage'}
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
                                    alt={group.name}
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
                                        {group.name}
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
                                {group.contacts} contacts
                            </div>
                        </div>

                        {/* Full description div, initially hidden */}
                        <div className="full-description">{group.description}</div>
                    </div>
                    

                    
                ))}
            </div>

            <div className="event-card-container">
                {groupEvent.map((group) => (
                    <div key={group.id} className="event-card">
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
                }}
            >
                {postsData.map((post, index) => (
                    <Post index={post.groupName} post={post} />
                ))}
            </div>
            <style jsx>{`
                .group-card-container {
                        width: 95%; /* Set initial width to 95% */
                        margin-left: 2.5%;
                        margin-top: 2.5%;
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
                display: flex;
                width:95%;
                margin-left: 2.5%;
                margin-top: 1.5%;
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
                height: 150px;
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


const groupData = [
    {
        name: "SMM Business Retreat",
        contacts: "50",
        date: "Feb 12, 2019",
        description: "A retreat for social media marketing professionals to connect and learn.",
        image: "https://picsum.photos/200/300?random=7", // Placeholder image link
    },
    {
        name: "Ladies out Loud",
        contacts: "2,500",
        date: "Jan 15, 2019",
        description:
            "A community for women entrepreneurs to share ideas and grow their businesses.",
        image: "https://picsum.photos/200/300?random=1", // Placeholder image link
    },
    {
        name: "Quote of the day",
        contacts: "724",
        date: "Jan 15, 2019",
        description: "A daily collection of motivational quotes to inspire your day.",
        image: "https://picsum.photos/200/300?random=2", // Placeholder image link
    },
    {
        name: "Global Warming Strategy",
        contacts: "5,037",
        date: "Jan 15, 2019",
        description: "A forum to discuss strategies to combat global warming and its effects.",
        image: "https://picsum.photos/200/300?random=3", // Placeholder image link
    },
    {
        name: "Power Women of NSA",
        contacts: "453",
        date: "Jan 05, 2019",
        description: "A support network for women excelling in national security roles.",
        image: "https://picsum.photos/200/300?random=4", // Placeholder image link
    },
    {
        name: "Quality Screen Time",
        contacts: "567",
        date: "Dec 25, 2018",
        description: "Best practices for ensuring productive and healthy screen time habits.",
        image: "https://picsum.photos/200/300?random=5", // Placeholder image link
    },
    {
        name: "Social Media Dominator",
        contacts: "896",
        date: "Dec 25, 2018",
        description: "Master the art of social media marketing with expert strategies and tips.",
        image: "https://picsum.photos/200/300?random=6", // Placeholder image link
    },
    // Add more group data objects as needed
];

const postsData = [
    {
        groupName: "Dribbble Shots Community",
        groupImage: "https://picsum.photos/200/300?random=1",
        username: "Jonathan",
        userImage: "https://picsum.photos/200/300?random=2",
        time: "Just Now",
        content: "Hi guys, today I’m bringing you a UI design for Logistic Website.",
        postImage: "https://picsum.photos/200/300?random=3",
    },
    {
        groupName: "Code Newbie",
        groupImage: "https://picsum.photos/200/300?random=4",
        username: "Alice",
        userImage: "https://picsum.photos/200/300?random=5",
        time: "2 hours ago",
        content: "Excited to share my first open-source contribution!",
        postImage: "https://picsum.photos/200/300?random=6",
    },
    // Extra posts
    {
        groupName: "Creative Designers",
        groupImage: "https://picsum.photos/200/300?random=7",
        username: "Eve",
        userImage: "https://picsum.photos/200/300?random=8",
        time: "1 day ago",
        content: "Here’s a sneak peek of my latest design project. Hope you like it!",
        postImage: "https://picsum.photos/200/300?random=9",
    },
    {
        groupName: "Tech Enthusiasts",
        groupImage: "https://picsum.photos/200/300?random=10",
        username: "Mark",
        userImage: "https://picsum.photos/200/300?random=11",
        time: "3 days ago",
        content: "Just started learning about blockchain technology. It’s fascinating!",
        postImage: "https://picsum.photos/200/300?random=12",
    },
    // Add more posts as needed
];


const groupEvent = [
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
