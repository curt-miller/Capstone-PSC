import React from "react";
import { data, useNavigate } from "react-router-dom";
import supabase from "../supaBaseClient";
import { useEffect, useState } from "react";

const Feed = ({ refreshPosts }) => {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

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

  // const handleDelete = async (postId) => {
  //   try {
  //     const { error } = await supabase.from("Posts").delete().eq("id", postId);

  //     if (error) {
  //       console.error("Error deleting post:", error);
  //     } else {
  //       // Update the posts state after deletion
  //       setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  //       console.log("Post deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error while deleting post:", error);
  //   }
  // };

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="post-card"
          onClick={() => navigate(`/attraction/${post.id}`)}
        >
          <img src={post.img_url} alt={post.title} />

          <h1>{post.title}</h1>
          <p>Username: {post.Users?.display_name || "Unknown User"}</p>
          <h2>{post.description}</h2>
          <h3>{post.location}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(post.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Feed;
