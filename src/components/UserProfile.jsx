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
  const [countryMap, setCountryMap] = useState({});
  const [refreshPosts, setRefreshPosts] = useState(false);

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
          flag: countryMapping[country.country_name] || null,
        }));

        setVisitedCountries(visitedWithFlags);

        // Fetch liked countries
        const { data: likedData } = await supabase
          .from("LikedCountries")
          .select("country_name")
          .eq("user_id", profileId);

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
  }, [profileId]);

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
            <br />
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
