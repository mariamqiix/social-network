import Post from "../components/GroupPostContent"; // Adjust the path if necessary
import { randomColor } from "../components/colors"; // Adjust the path if necessary

export default function Page() {
    return (
        <div
            id="groups"
            style={{
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                overflowY: "hidden",
                backgroundColor: "#f0f4f7", // Light background
            }}
        >
            <div
                className="group-card-container"
                style={{
                    marginLeft: "2.5%",
                    marginTop: "2.5%",
                    top: "0%",
                    display: "flex",
                    overflowX: "scroll",
                    gap: "20px",
                    minHeight: "190px",
                    width: "95%",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "white",
                    borderRadius: "20px",
                }}
            >
                {groupData.map((group, index) => (
                    <div
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
