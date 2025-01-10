import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import Nav from "./Nav";

export default function AttractionDetail() {
    const { id } = useParams(); // Get the post ID from the route
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data: post, error: fetchError } = await supabase
                    .from("Posts")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (fetchError) {
                    console.error("Error fetching post:", fetchError);
                    setError("Could not fetch post details. Please try again.");
                } else {
                    setPost(post);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("Something went wrong. Please try again.");
            }
        };

        if (id) fetchPost();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div id="att-detail-page-container">
            <Nav />
            <div id="att-detail-page-GRID">
                <div id="att-detail-page-TITLE">
                    <h1>{post.title}</h1>
                    <h3>
                        Posted by {post.user} | Location: {post.location} | {post.likes} Likes
                    </h3>
                </div>
                <div id="att-detail-page-REVIEWS">
                    <h2>User Reviews</h2>
                    {/* Example placeholder for reviews */}
                    <p>Review 1: Amazing place!</p>
                    <p>Review 2: Would visit again!</p>
                </div>
                <div id="att-detail-page-IMAGE">
                    <img
                        src={post.img_url}
                        alt={post.title}
                        // style={{
                        //     width: "100%",
                        //     height: "auto",
                        //     borderRadius: "8px",
                        //     objectFit: "cover",
                        // }}
                    />
                </div>
            </div>
        </div>
    );
}
