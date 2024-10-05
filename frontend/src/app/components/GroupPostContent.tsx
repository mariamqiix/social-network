import React from "react";

// Define your Client Component here
const Post = ({ index, post }) => (
    <div
        key={index}
        style={{
            flex: "1 1 calc(90% - 30px)",
            position: "relative",
            backgroundColor: "white",
            borderRadius: "30px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            width: "100%", // Make width 100% to allow grid to control the size
            padding: "20px",
            marginBottom: "20px",
        }}
    >
        {/* Group and User Info */}
        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
            }}
        >
            <img
                src={post.groupImage}
                alt="Group"
                style={{
                    borderRadius: "20px",
                    marginRight: "10px",
                    width: "70px",
                    height: "70px",
                }}
            />
            <div style={{ flexGrow: 1,
                marginLeft: "10px",
             }}>
                <h3
                    style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#333",
                    }}
                >
                    {post.groupName}
                </h3>
                <div
                    style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.9rem",
                        color: "#888",
                    }}
                >
                    <img
                        src={post.userImage}
                        alt="User"
                        style={{
                            borderRadius: "50%",
                            marginRight: "8px",
                            width: "30px",
                            height: "30px",
                        }}
                    />
                    <span style={{ color: "#0073e6", marginRight: "5px" }}>{post.username}</span>
                    <span style={{ fontSize: "0.8rem", color: "#aaa" }}>{post.time}</span>
                </div>
            </div>
        </div>

        {/* Post Content */}
        <div
            style={{
                marginBottom: "15px",
            }}
        >
            <p style={{ margin: "0 0 10px 0" }}>{post.content}</p>
            <img
                src={post.postImage}
                alt="Post Content"
                style={{
                    width: "100%",
                    borderRadius: "8px",
                }}
            />
        </div>
    </div>
);

export default Post;
