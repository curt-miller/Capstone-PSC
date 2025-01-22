import React, { useState, useEffect } from "react";
import Feed from "./Feed";
import Nav from "./Nav";
import supabase from "../supaBaseClient";
import { Link } from "react-router-dom";
import { fetchCountries } from "../API/countries";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [likedCountries, setLikedCountries] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [countryMap, setCountryMap] = useState({}); // To store country name-to-flag mapping
  const navigate = useNavigate();

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
    const fetchFollowers = async () => {
      try {
        const { data, error } = await supabase
          .from("Following")
          .select("following_id, Users!fk_following_id(profilePicture)")
          .eq("user_id", userId); // Who I am following

        if (error) throw error;

        console.log("Follower list fetched:", data);
        setFollowers(data || []);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };
    fetchFollowers();
  }, [userId]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const { data, error } = await supabase
          .from("Following")
          .select("user_id, Users!fk_user_id(profilePicture)")
          .eq("following_id", userId);

        if (error) throw error;

        console.log("Following list fetched:", data); // Logs the fetched data
        setFollowing(data || []); // Updates state
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };
    fetchFollowing();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the list of countries with flags
        const allCountries = await fetchCountries();
        const countryMapping = allCountries.reduce((acc, country) => {
          acc[country.name] = country.href.flag; // Assuming the API provides name and flag
          return acc;
        }, {});

        setCountryMap(countryMapping);

        // Fetch visited countries from Supabase

        const { data: visitedData, error: visitedError } = await supabase
          .from("VisitedCountries")
          .select("country_name")
          .eq("user_id", userId);

        if (visitedError) throw visitedError;

        const visitedWithFlags = (visitedData || []).map((country) => ({
          name: country.country_name,
          flag: countryMapping[country.country_name] || null
        }));

        setVisitedCountries(visitedWithFlags);

        // Fetch liked countries from Supabase
        const { data: likedData, error: likedError } = await supabase
          .from("LikedCountries")
          .select("country_name")
          .eq("user_id", userId);

        if (likedError) throw likedError;

        const likedWithFlags = (likedData || []).map((country) => ({
          name: country.country_name,
          flag: countryMapping[country.country_name] || null
        }));

        setLikedCountries(likedWithFlags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleClickCountry = (country) => {
    localStorage.setItem("country", JSON.stringify(country));
    console.log(country);
    navigate(`/${country.name}`);
  };

  const handleClickFriend = (profileId) => {
    console.log("follower", profileId);
    localStorage.setItem("profileId", profileId);
    navigate(`/${profileId}/profile`);
  };

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
                  pathname: `/${userId}/settings`
                }}
              >
                edit profile
              </Link>
              <div className="follow-list">
                <h3>Followers</h3>
                {followers.length > 0 ? (
                  followers.map((follower, index) => (
                    <button
                      key={index}
                      to={`/${follower.following_id}/profile`}
                      className="follower-card-link"
                      onClick={() => handleClickFriend(follower.following_id)}
                    >
                      <img
                        key={index}
                        src={follower.Users.profilePicture}
                        alt="follower list"
                      />
                    </button>
                  ))
                ) : (
                  <p>No followers yet.</p>
                )}
              </div>
              <div className="follow-list">
                <h3>Following</h3>
                {following.length > 0 ? (
                  following.map((follow, index) => (
                    <button
                      key={index}
                      to={`/${follow.user_id}/profile`}
                      className="follower-card-link"
                      onClick={() => handleClickFriend(follow.user_id)}
                    >
                      <img
                        key={index}
                        src={follow.Users.profilePicture}
                        alt="follower list"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </button>
                  ))
                ) : (
                  <p>No followers yet.</p>
                )}
              </div>
              <br />
              <div className="user_page_visited_list">
                <h3>Visited Countries</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {visitedCountries.length > 0 ? (
                    visitedCountries.map((country, index) => (
                      <button
                        key={index}
                        className="country_card_link"
                        onClick={() => handleClickCountry(country)}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          title={country.name}
                          style={{ width: "40px", height: "30px" }}
                        />
                      </button>
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
                      <button
                        key={index}
                        className="country_card_link"
                        onClick={() => handleClickCountry(country)}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          title={country.name}
                          style={{ width: "40px", height: "30px" }}
                        />
                      </button>
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
                onClick={() => setShowFollowingPosts(false)}
                className={!showFollowingPosts ? "active-toggle" : ""}
              >
                My Posts
              </button>
              <button
                onClick={() => setShowFollowingPosts(true)}
                className={showFollowingPosts ? "active-toggle" : ""}
              >
                People I Follow
              </button>
            </div>
            <div className="feed-container-FEED">
              <Feed
                refreshPosts={refreshPosts}
                userId={userId}
                followerPosts={showFollowingPosts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
