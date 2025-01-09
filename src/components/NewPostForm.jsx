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

    if (!location || !location.country) {
      console.error("Please provide a valid location with a country.");
      return;
    }

    // SAM GET UR COUNTRY INFO HERE:
    console.log("Country on submit:", location.country); // Log only the country
    const countrySlug = location.country?.trim().toLowerCase() || "";
    console.log("slug:", countrySlug);
    try {
      const { data, error } = await supabase.from("Posts").insert([
        {
          title: title,
          description: description,
          img_url: imageUrl,
          location: countrySlug // Ensure this matches your table's column name and type
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

        <div>
          <label htmlFor="description">
            Description :
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            placeholder="100 characters max"
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

        <div id="newpost-map">
          <MapSearch onLocationChange={setLocation} location={location} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );

}
