import React from "react";
import { data } from "react-router-dom";
import supabase from "../supaBaseClient";
import { useEffect, useState } from "react";

const Feed = ({ refreshPosts }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
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
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Feed;
