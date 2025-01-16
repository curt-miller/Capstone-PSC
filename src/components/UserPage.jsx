import React, { useState, useEffect } from "react";
import Feed from "./Feed";
import Nav from "./Nav";
import supabase from "../supaBaseClient";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [likedCountries, setLikedCountries] = useState([]);

  const userId = localStorage.getItem("userId");
  const displayName = localStorage.getItem("displayName");

  const handleRefresh = () => {
    setRefreshPosts((prev) => !prev);
  };

  // Fetch visited countries
  useEffect(() => {
    const fetchVisitedCountries = async () => {
      try {
        const { data, error } = await supabase
          .from("VisitedCountries")
          .select("country_name")
          .eq("user_id", userId);

        if (error) throw error;

        setVisitedCountries(data || []);
      } catch (error) {
        console.error("Error fetching visited countries:", error);
      }
    };

    fetchVisitedCountries();
  }, [userId]);

  // Fetch liked countries
  useEffect(() => {
    const fetchLikedCountries = async () => {
      try {
        const { data, error } = await supabase
          .from("LikedCountries")
          .select("country_name")
          .eq("user_id", userId);

        if (error) throw error;

        setLikedCountries(data || []);
      } catch (error) {
        console.error("Error fetching liked countries:", error);
      }
    };

    fetchLikedCountries();
  }, [userId]);

  return (
    <div className="user-profile-page-container">
      <Nav />
      <div className="user-profile-page-content">
        <div className="user-profile-sidebar">
          <p className="user-profile-welcome">Welcome Back, {displayName}</p>

          <div className="user-profile-user-info">
            <div className="user_profile_pic">picture</div>
            <br />
            <div className="user_page_visited_list">
              <h3>Visited Countries:</h3>
              <ul>
                {visitedCountries.length > 0 ? (
                  visitedCountries.map((country, index) => (
                    <li key={index}>{country.country_name}</li>
                  ))
                ) : (
                  <li>No countries visited yet.</li>
                )}
              </ul>
            </div>
            <br />
            <div className="user_page_liked_list">
              <h3>Liked Countries:</h3>
              <ul>
                {likedCountries.length > 0 ? (
                  likedCountries.map((country, index) => (
                    <li key={index}>{country.country_name}</li>
                  ))
                ) : (
                  <li>No countries liked yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="feed-container">
          <h1 className="user-profile-page-YOUR-POSTS">Your Posts</h1>
          <Feed refreshPosts={refreshPosts} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
