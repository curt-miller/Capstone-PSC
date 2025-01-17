import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supaBaseClient";
import LikeButton from "./LikeButton";

const Feed = ({ refreshPosts, userId, followerPosts = false }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = supabase
          .from("Posts")
          .select(
            `
            id,
            title,
            img_url,
            description,
            location,
            user_id,
            Users(display_name, profilePicture)
          `
          )
          .order("created_at", { ascending: false });

        if (followerPosts) {
          const { data: followingIds, error: followingError } = await supabase
            .from("Following")
            .select("following_id")
            .eq("user_id", userId);

          if (followingError) {
            console.error("Error fetching following IDs:", followingError);
            return;
          }

          const ids = followingIds?.map((item) => item.following_id) || [];
          query = query.in("user_id", ids);
        } else {
          query = query.eq("user_id", userId);
        }

        const { data: posts, error: fetchError } = await query;

        if (fetchError) {
          console.error("Error fetching posts:", fetchError);
        } else {
          setPosts(posts);
        }
      } catch (error) {
        console.error("Error during fetching posts", error);
      }
    };

    fetchPosts();
  }, [refreshPosts, followerPosts, userId]);

  const deletePost = async (postId) => {
    try {
      const { error } = await supabase
        .from("Posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting post:", error);
      } else {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <div
              className="post-card"
              onClick={(e) => {
                if (!e.defaultPrevented) {
                  navigate(`/attraction/${post.id}`);
                }
              }}
            >
              <div className="post-card-IMAGE-BLOCK">
                <img src={post.img_url} alt={post.title} />
              </div>
              <h1>{post.title}</h1>
              <div className="post-card-USER">
                <img
                  src={post.Users?.profilePicture || "default-profile-pic-url"}
                  alt="profile picture"
                />
              </div>
              <div className="post-card-BLURB">
                <h2>{post.description}</h2>
              </div>
              <h3>{post.location}</h3>
              <div className="post-card-BUTTON-CONTAINER">
                <LikeButton post_id={post.id} userId={userId} />
                <div className="post-card-DELETE-BUTTON">
                  {post.user_id === userId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(post.id);
                      }}
                    >
                      delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
