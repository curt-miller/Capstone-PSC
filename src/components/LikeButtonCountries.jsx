import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const LikeButtonCountries = ({ country_name }) => {
  const user_id = localStorage.getItem("userId");
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikes = async () => {
    try {
      const { count, error: countError } = await supabase
        .from("LikedCountries")
        .select("*", { count: "exact" })
        .eq("country_name", country_name.name);

      if (countError) throw countError;

      setLikesCount(count || 0);

      const { data: likeData, error: likeError } = await supabase
        .from("LikedCountries")
        .select("*")
        .eq("country_name", country_name.name)
        .eq("user_id", user_id);

      if (likeError) throw likeError;

      setLiked(likeData.length > 0);
    } catch (error) {
      console.error("Unexpected error fetching likes:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [country_name, user_id]);

  const handleLiked = async (e) => {
    e.stopPropagation();
    try {
      if (liked) {
        await supabase
          .from("LikedCountries")
          .delete()
          .eq("country_name", country_name.name)
          .eq("user_id", user_id);
        setLikesCount((prev) => prev - 1);
        setLiked(false);
      } else {
        await supabase
          .from("LikedCountries")
          .insert([{ country_name: country_name.name, user_id: user_id }]);
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <button onClick={handleLiked} className={`country-card-like-button`}>
      {liked ? <FaHeart className="liked" /> : <CiHeart className="notLiked" />}{" "}
      ({likesCount})
    </button>
  );
};

export default LikeButtonCountries;
