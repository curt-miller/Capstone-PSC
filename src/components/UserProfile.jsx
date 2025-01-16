import React from "react";
import { useState, useEffect } from "react";
import supabase from "../supaBaseClient";

const UserProfile = () => {
  const profileId = localStorage.getItem("profileId") || "Guest";
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);

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
        console.log(data);
      } catch (error) {
        console.error("Error fetching visited countries", error);
      }
    };
    fetchProfile();
  }, [profileId]);

  useEffect(() => {
    // Fetch posts where user_id matches profileId
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("Posts")
          .select("*")
          .eq("user_id", profileId);

        if (error) throw error;
        setPosts(data);
        console.log("Posts data:", data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    if (profileId) {
      fetchPosts();
    }
  }, [profileId]);

  return (
    <div>
      <div>
        <p>{profile.display_name}</p>
        <img
          src={profile.profilePicture}
          alt={profile.display_name}
          style={{ height: "80px", width: "auto" }}
        />
      </div>
      <div>
        <h2>User Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} style={{ marginBottom: "20px" }}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <img
                src={post.img_url}
                alt={post.title}
                style={{ height: "100px", width: "auto" }}
              />
            </div>
          ))
        ) : (
          <p>No posts found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
