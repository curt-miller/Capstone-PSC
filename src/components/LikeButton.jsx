import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import likeButton from "../assets/LikeButton.png";
import supabase from "../supaBaseClient";

const LikeButton = ({ post_id }) => {
  const { id } = useParams(); // Get the post ID from the route

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

  const handleLiked = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      if (!user) {
        console.error("No user logged in.");
        return;
      }

      const { data: userData, error: userQueryError } = await supabase
        .from("Users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userQueryError || !userData) {
        console.error("Error fetching user data:", userQueryError);
        return;
      }

      const { data, error } = await supabase
        .from("Likes")
        .insert([
          {
            post_id: id,
            user_id: userData.id
          }
        ])
        .select();
      console.log("post_id: ", id, "user_id: ", userData.id);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <button className="like_country_button">
      <img
        src={likeButton}
        alt="Like button Icon"
        className="like_button_icon"
        onClick={handleLiked}
      />
    </button>
  );
};

export default LikeButton;
