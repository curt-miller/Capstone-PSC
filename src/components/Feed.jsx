import React from "react";
import { data, useNavigate } from "react-router-dom";
import supabase from "../supaBaseClient";
import { useEffect, useState } from "react";
import LikeButton from "./LikeButton";

const Feed = ({ refreshPosts, userId }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

console.log(posts);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error: fetchError } = await supabase
          .from("Posts")
          .select(
            `
            id,
            title,
            img_url,
            description,
            location,
            user_id,
            Users(display_name)
            Users(profilePicture)
          `
          )
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching posts:", fetchError);
        } else {
          setPosts(posts);
        }
      } catch (error) {
        console.error("Error during fetching posts", error);
        setError("Something went wrong. Please try again.");
      }
    };
    fetchPosts();
  }, [refreshPosts]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <div
            className="post-card"
            onClick={() => navigate(`/attraction/${post.id}`)}
          >
            <div className="post-card-IMAGE-BLOCK">
              <img src={post.img_url} alt={post.title} />
            </div>
            <h1>{post.title}</h1>
            <div className="post-card-USERNAME-AND-PHOTO">
            <p>{post.Users?.display_name || "Unknown User"}</p>
              <img src={post.Users?.profilePicture} alt="profile picture" />
            </div>
            <h2>{post.description}</h2>
            <h3>{post.location}</h3>
            <LikeButton post_id={post.id} userId={userId} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
