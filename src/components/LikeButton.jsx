import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supaBaseClient";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ post_id, userId }) => {
  const user_id = userId;
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { count, error: countError } = await supabase
          .from("Likes")
          .select("*", { count: "exact" })
          .eq("post_id", post_id);

        if (countError) {
          console.error("Error fetching likes count:", countError);
          return;
        }

        const { data, error: dataError } = await supabase
          .from("Likes")
          .select("*")
          .eq("post_id", post_id)
          .eq("user_id", user_id);

        if (dataError) {
          console.log("post_id:", post_id, "userId:", user_id);
          console.error("Error fetching user like status:", dataError);
          return;
        }

        setLikesCount(count || 0);
        setLiked(data.length > 0);
      } catch (error) {
        console.error("Unexpected error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [post_id, user_id]);

  const handleLiked = async (e) => {
    e.stopPropagation();
    if (liked) {
      await supabase
        .from("Likes")
        .delete()
        .eq("post_id", post_id)
        .eq("user_id", userId);
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await supabase
        .from("Likes")
        .insert([{ post_id: post_id, user_id: userId }]);
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <button className="like_button" onClick={handleLiked}>
      {liked ? <FaHeart className="liked" /> : <CiHeart className="notLiked" />}{" "}
      ({likesCount}){" "}
    </button>
  );
};

export default LikeButton;
