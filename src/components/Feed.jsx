import React from "react";
import { data } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error: fetchError } = await supabase
          .from("Posts")
          .select("*");

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
  }, []);
  return (
    <div>
      <h1>Feed</h1>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <p>
            <strong>Title:</strong> {post.title}
          </p>
          <p>
            <strong>Description:</strong> {post.description}
          </p>
          <img src={post.img_url} alt={post.title} />
          <p>Location {post.location}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
