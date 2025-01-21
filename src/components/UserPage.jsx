import React, { useState, useEffect } from "react";
import Feed from "./Feed";
import Nav from "./Nav";
import supabase from "../supaBaseClient";
import { Link } from "react-router-dom";
import { fetchCountries } from "../API/countries";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [showFollowerPosts, setShowFollowerPosts] = useState(false); // State to toggle between your posts and follower posts
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [likedCountries, setLikedCountries] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);
  const [countryMap, setCountryMap] = useState({}); // To store country name-to-flag mapping

  const userId = localStorage.getItem("userId");
  const displayName = localStorage.getItem("displayName");

  const handleRefresh = () => {
    setRefreshPosts((prev) => !prev);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const { data, error } = await supabase
          .from("Users")
          .select("profilePicture")
          .eq("id", userId)
          .single();

        if (error) throw error;

        setProfilePicture(data?.profilePicture || "");
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfilePicture();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCountries = await fetchCountries();
        const countryMapping = allCountries.reduce((acc, country) => {
          acc[country.name] = country.href.flag; // Assuming the API provides name and flag
          return acc;
        }, {});

        setCountryMap(countryMapping);

        const { data: visitedData, error: visitedError } = await supabase
          .from("VisitedCountries")
          .select("country_name")
          .eq("user_id", userId);

        if (visitedError) throw visitedError;

        const visitedWithFlags = (visitedData || []).map((country) => ({
          name: country.country_name,
          flag: countryMapping[country.country_name] || null,
        }));

        setVisitedCountries(visitedWithFlags);

        const { data: likedData, error: likedError } = await supabase
          .from("LikedCountries")
          .select("country_name")
          .eq("user_id", userId);

        if (likedError) throw likedError;

        const likedWithFlags = (likedData || []).map((country) => ({
          name: country.country_name,
          flag: countryMapping[country.country_name] || null,
        }));

        setLikedCountries(likedWithFlags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <div className="user-profile-page-container">
        <Nav />
        <div className="user-profile-page-content">
          <div className="user-profile-sidebar">
            <p className="user-profile-welcome">Welcome Back, {displayName}</p>
            <div className="user-profile-user-info">
              <img
                src={
                  profilePicture ||
                  "https://wagtwrwcrjgunioswvkr.supabase.co/storage/v1/object/public/profile-pictures/public/profile%20picture.jpg"
                }
                alt={displayName}
                className="user_profile_pic"
              />
              <Link
                to={{
                  pathname: `/${userId}/settings`,
                }}
              >
                edit profile
              </Link>
              <br />
              <div className="user_page_visited_list">
                <h3>Visited Countries</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {visitedCountries.length > 0 ? (
                    visitedCountries.map((country, index) => (
                      <Link
                        to={{
                          pathname: `/${country.name.toLowerCase()}`,
                        }}
                        key={index}
                        className="country_card_link"
                        onClick={() => setCountry(country)}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          style={{ width: "30px", height: "20px" }}
                        />
                      </Link>
                    ))
                  ) : (
                    <p>No countries visited yet.</p>
                  )}
                </div>
              </div>
              <br />
              <div className="user_page_liked_list">
                <h3>Liked Countries</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {likedCountries.length > 0 ? (
                    likedCountries.map((country, index) => (
                      <Link
                        to={{
                          pathname: `/${country.name.toLowerCase()}`,
                        }}
                        key={index}
                        className="country_card_link"
                        onClick={() => setCountry(country)}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          style={{ width: "30px", height: "20px" }}
                        />
                      </Link>
                    ))
                  ) : (
                    <p>No countries liked yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="feed-container">
            <div className="toggle-buttons">
              <button
                onClick={() => setShowFollowerPosts(false)}
                className={!showFollowerPosts ? "active-toggle" : ""}
              >
                My Posts
              </button>
              <button
                onClick={() => setShowFollowerPosts(true)}
                className={showFollowerPosts ? "active-toggle" : ""}
              >
                Posts from Followers
              </button>
            </div>
            <div className="feed-container-FEED">
            <Feed
              refreshPosts={refreshPosts}
              userId={userId}
              followerPosts={showFollowerPosts}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
