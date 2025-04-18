import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { fetchLikedCountries } from "../../utils/fetchUserData";

const LikeButtonCountries = ({ country_name }) => {
  const user_id = localStorage.getItem("userId");
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likedList, setlikedList] = useState([]);

  useEffect(() => {
    fetchLikedCountries();
  }, [country_name, user_id]);

  const handleLiked = () => {
    console.log("liked");
  };

  return (
    <button onClick={handleLiked} className={`country-card-like-button`}>
      {liked ? <FaHeart className="liked" /> : <CiHeart className="notLiked" />}{" "}
      ({likesCount})
    </button>
  );
};

export default LikeButtonCountries;
