import React from "react";
import { PostResponse } from "../types/Types";
import { height } from "@fortawesome/free-solid-svg-icons/faExclamation";
import { relative } from "path";
import Link from 'next/link';

// Define your Client Component here
const Post = ({ post }: { post: PostResponse }) => (
    <Link href={post.author == null ? "" : "/posts/" + post.id} className='text-decoration-none text-black'>
    <div
        key={`postId${post.id}`}
        style={{
            flex: "1 1 calc(90% - 30px)",
            position: "relative",
            backgroundColor: "white",
            borderRadius: "30px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            width: "100%", // Make width 100% to allow grid to control the size
            padding: "20px",
            marginBottom: "20px",
            minHeight: "800px",
            maxHeight: "800px",
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

            {post.group && <img
                src={`data:image/jpeg;base64,${post.group.image_url}`}
                alt="Group"
                style={{
                    borderRadius: "20px",
                    marginRight: "10px",
                    width: "70px",
                    height: "70px",
                }}
            />}
            <div style={{ flexGrow: 1, marginLeft: "10px" }}>
                {post.group && <h3
                    style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#333",
                    }}
                >
                    {post.group.title}
                </h3>}
                <Link href={post.author == null ? "" : "/profile/" + post.author.id} className='text-decoration-none text-black'>
                    <div
                        style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                            color: "#888",
                        }}
                    >
                        {post.author && (
                            <img
                                src={`data:image/jpeg;base64,${post.author.image_url}`}
                                alt="User"
                                style={{
                                    borderRadius: "50%",
                                    marginRight: "8px",
                                    width: "30px",
                                    height: "30px",
                                }}
                            />
                        )}
                        <span style={{ color: "#0073e6", marginRight: "5px" }}>{post.author.username}</span>
                        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>{post.created_at}</span>
                    </div>
                </Link>
            </div>
        </div>

        {/* Post Content */}
        <div style={{ marginBottom: "15px" }}>
            <p style={{ margin: "0 0 10px 0" }}>{post.content}</p>
            {post.image_url && (
                <img
                    src={`data:image/png;base64,${post.image_url}`}
                    alt="Post Content"
                    style={{
                        width: "100%",
                        maxHeight: "600px",
                        minHeight: "600px",
                        borderRadius: "8px",
                        margin: "auto",
                        objectFit: "cover", // Ensures the image covers the container
                        display: "block", // Centers the image
                    }}
                />
            )}
        </div>

    </div>
    </Link>

);

export default Post;

function RandomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}