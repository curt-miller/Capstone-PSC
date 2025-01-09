import React, { useState } from "react";
import MapSearch from "./MapSearch";
import supabase from "../config/supabaseClient";

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

    try {
      const { data, error } = await supabase.from("Posts").insert([
        {
          title: title,
          description: description,
          img_url: imageUrl,
          location: location // Ensure this matches your table's column name and type
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
    <div id="submit-page">
      <div id="submit-form">
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

          <div>
            <label htmlFor="description">
              Description (140 characters max):
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={140}
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <MapSearch onLocationChange={setLocation} location={location} />
      </div>
    </div>
  );
}
