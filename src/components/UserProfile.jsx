import React, { useEffect, useState } from "react";
import supabase from "../supaBaseClient";
import Feed from "./Feed";
import Nav from "./Nav";
import { fetchCountries } from "../API/countries";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const profileId = localStorage.getItem("profileId") || "Guest";
  const [profile, setProfile] = useState({});
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [likedCountries, setLikedCountries] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [countryMap, setCountryMap] = useState({});
  const [refreshPosts, setRefreshPosts] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("Users")
          .select("*")
          .eq("id", profileId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [profileId]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const { data, error } = await supabase
          .from("Following")
          .select("following_id, Users!fk_following_id(profilePicture)")
          .eq("user_id", profileId); // Who I am following

        if (error) throw error;

        console.log("Follower list fetched:", data);
        setFollowers(data || []);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };
    fetchFollowers();
  }, [profileId]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const { data, error } = await supabase
          .from("Following")
          .select("user_id, Users!fk_user_id(profilePicture)")
          .eq("following_id", profileId);

        if (error) throw error;

        console.log("Following list fetched:", data); // Logs the fetched data
        setFollowing(data || []); // Updates state
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };
    fetchFollowing();
  }, [profileId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the list of countries with flags
        const allCountries = await fetchCountries();
        const countryMapping = allCountries.reduce((acc, country) => {
          acc[country.name] = country.href.flag;
          return acc;
        }, {});

        setCountryMap(countryMapping);

        // Fetch visited countries
        const { data: visitedData } = await supabase
          .from("VisitedCountries")
          .select("country_name")
          .eq("user_id", profileId);

        const visitedWithFlags = (visitedData || []).map((country) => ({
          name: country.country_name,
          flag: countryMapping[country.country_name] || null
        }));

        setVisitedCountries(visitedWithFlags);

        // Fetch liked countries
        const { data: likedData } = await supabase
          .from("LikedCountries")
          .select("country_name")
          .eq("user_id", profileId);

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
  }, [profileId]);

  const handleFollow = async (e) => {
    try {
      // Check if the follow relationship already exists
      const { data: existingFollowing, error: checkFollowingError } =
        await supabase
          .from("Following")
          .select("*")
          .eq("following_id", userId)
          .eq("user_id", profileId)
          .single();

      if (checkFollowingError && checkFollowingError.code !== "PGRST116") {
        throw checkFollowingError;
      }

      if (!existingFollowing) {
        // Add the follow relationship to the "Following" table
        const { data: followingData, error: followingError } = await supabase
          .from("Following")
          .insert([
            {
              following_id: userId, // The user being followed
              user_id: profileId // The user performing the follow action
            }
          ]);

        if (followingError) throw followingError;

        // Add the reciprocal relationship to the "Followers" table
        const { data: followerData, error: followerError } = await supabase
          .from("Followers")
          .insert([
            {
              follower_id: profileId, // The user performing the follow action
              user_id: userId // The user being followed
            }
          ]);

        if (followerError) throw followerError;

        console.log("Follow relationship successfully added.");
      } else {
        console.log("Follow relationship already exists.");
      }
    } catch (error) {
      console.error("Error handling follow action:", error);
    }
  };

  return (
    <div className="user-profile-page-container">
      <Nav />
      <div className="user-profile-page-content">
        <div className="user-profile-sidebar">
          <p className="user-profile-welcome">
            Welcome Back, {profile.display_name}
          </p>
          <div className="user-profile-user-info">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/150"}
              alt={profile.display_name}
              className="user_profile_pic"
            />
            <button onClick={handleFollow}>FOLLOW</button>
            <br />
            <div className="follow-list">
              <h3>Followers</h3>
              {followers.length > 0 ? (
                followers.map((follower, index) => (
                  <img
                    key={index}
                    src={follower.Users.profilePicture}
                    alt="follower list"
                    style={{ width: "40px", height: "40px" }}
                  />
                ))
              ) : (
                <p>No followers yet.</p>
              )}
            </div>
            <div className="follow-list">
              <h3>Following</h3>
              {following.length > 0 ? (
                following.map((follow, index) => (
                  <img
                    key={index}
                    src={follow.Users.profilePicture}
                    alt="follower list"
                    style={{ width: "40px", height: "40px" }}
                  />
                ))
              ) : (
                <p>No followers yet.</p>
              )}
            </div>
            <br></br>
            <div className="user_page_visited_list">
              <h3>Visited Countries</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {visitedCountries.length > 0 ? (
                  visitedCountries.map((country, index) => (
                    <Link
                      to={`/${country.name.toLowerCase()}`}
                      key={index}
                      className="country_card_link"
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
                      to={`/${country.name.toLowerCase()}`}
                      key={index}
                      className="country_card_link"
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
          <h1 className="user-profile-page-YOUR-POSTS">
            {profile.display_name}'s Posts
          </h1>
          <Feed
            refreshPosts={refreshPosts}
            userId={profileId}
            followerPosts={false}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
