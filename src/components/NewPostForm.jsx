import React, { useState, useEffect } from "react";
import MapSearch from "./MapSearch"; 
import supabase from "../supaBaseClient";

export default function NewPostForm({ onPostSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState(null); // Capture marker coordinates

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!title || !description || !imageUrl) {
      console.error("Please provide all required fields.");
      return;
    }

    if (!location || !location.country) {
      console.error("Please provide a valid location with a country.");
      return;
    }

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      console.log("USER:", user);
      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      if (!user) {
        console.error("No user logged in.");
        return;
      }

      const { data: userData, error: userQueryError } = await supabase
        .from("Users")
        .select("*")
        .eq("user_id", user.id) // Assuming `auth_user_id` links `Users` to `auth.users`
        .single();

      console.log("USERDATA", userData);

      const { data, error } = await supabase.from("Posts").insert([
        {
          title: title,
          description: description,
          img_url: imageUrl,
          location: location.country, 
          user_id: userData.id
        }
      ]);

      if (error) {
        console.error("Error inserting post:", error);
      } else {
        console.log("Post added successfully:", data);
        setTitle("");
        setDescription("");
        setImageUrl("");
        setLocation(null);

        onPostSubmit();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div id="newpost-form">
      <h1>Drop a Pin!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <br />

        <div className="new_post_description">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            placeholder="100 characters max"
            required
          />
        </div>
        <br />

        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <br />




        <div id="newpost-map">
          <MapSearch onLocationChange={setLocation} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
