import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ post_id }) => {
  const user_id = localStorage.getItem("userId");
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { count, error: countError } = await supabase
          .from("Likes")
          .select("*", { count: "exact" })
          .eq("post_id", post_id);

        if (countError) throw countError;

        setLikesCount(count || 0);

        const { data: likeData, error: likeError } = await supabase
          .from("Likes")
          .select("*")
          .eq("post_id", post_id)
          .eq("user_id", user_id);

        if (likeError) throw likeError;

        setLiked(likeData.length || 0);
      } catch (error) {
        console.error("Unexpected error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [post_id, user_id]);

  const handleLiked = async (e) => {
    e.stopPropagation();
    try {
      if (liked) {
        await supabase
          .from("Likes")
          .delete()
          .eq("post_id", post_id)
          .eq("user_id", user_id);
        setLikesCount((prev) => prev - 1);
        setLiked(false);
      } else {
        await supabase
          .from("Likes")
          .insert([{ post_id: post_id, user_id: user_id }]);
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <button onClick={handleLiked} className={`post-card-like-button`}>
      {liked ? <FaHeart className="liked" /> : <CiHeart className="notLiked" />}{" "}
      ({likesCount})
    </button>
  );
};

export default LikeButton;
