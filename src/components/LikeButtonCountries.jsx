import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const LikeButtonCountries = ({ country_name }) => {
  const user_id = localStorage.getItem("userId");

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { count, error: countError } = await supabase
          .from("LikedCountries")
          .select("*", { count: "exact" })
          .eq("country_name", country_name);

        if (countError) {
          console.error("Error fetching likes count:", countError);
          return;
        }

        const { data, error: dataError } = await supabase
          .from("LikedCountries")
          .select("*")
          .eq("country_name", country_name.name)
          .eq("user_id", user_id);

        if (dataError) {
          console.log("country_name:", country_name.name, "userId:", user_id);
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
  }, [country_name, user_id]);

  const handleLiked = async (e) => {
    e.stopPropagation();
    if (liked) {
      await supabase
        .from("LikedCountries")
        .delete()
        .eq("country_name", country_name)
        .eq("user_id", user_id);
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await supabase
        .from("LikedCountries")
        .upsert([{ country_name: country_name.name, user_id: user_id }]);
      console.log("country name:", country_name.name, "user id:", user_id);
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <button onClick={handleLiked} className={`post-card-like-button`}>
      {liked ? <FaHeart className="liked" /> : <CiHeart className="notLiked" />}{" "}
      ({likesCount}){" "}
    </button>
  );
};

export default LikeButtonCountries;
