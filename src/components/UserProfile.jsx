import React, { useEffect, useState } from "react";
import supabase from "../supaBaseClient";
import Feed from "./Feed";

const UserProfile = () => {
  const profileId = localStorage.getItem("profileId") || "Guest";
  const [profile, setProfile] = useState({});
  const [following, setFollowing] = useState([]);

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
    const fetchFollowing = async () => {
      try {
        const { data, error } = await supabase
          .from("Following")
          .select(
            `
          id,
          following_id,
          Users!Following_following_id_fkey(display_name, profilePicture)`
          )
          .eq("user_id", profileId);

        if (error) throw error;
        setFollowing(data);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };
    fetchFollowing();
  }, [profileId]);

  return (
    <div>
      <div>
        <p>{profile.display_name || "User not found"}</p>
        <img
          src={
            profile.profilePicture ||
            "https://via.placeholder.com/80" // Default profile picture if not found
          }
          alt={profile.display_name || "User"}
          style={{ height: "80px", width: "auto" }}
        />
      </div>
      <div>Following</div>
      <div>
        {following.length > 0 ? (
          following.map((follow) => (
            <img
              src={follow.Users.profilePicture}
              alt={follow.Users.display_name}
              key={follow.id}
              style={{ height: "80px", width: "auto" }}
            />
          ))
        ) : (
          <p>No following data available.</p>
        )}
      </div>
      <div>
        <h2>{profile.display_name}'s Posts</h2>
        {/* Pass userId directly to the Feed component */}
        <Feed refreshPosts={true} userId={profileId} followerPosts={false} />
      </div>
    </div>
  );
};

export default UserProfile;
