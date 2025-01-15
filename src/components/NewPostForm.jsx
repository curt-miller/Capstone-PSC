import React, { useState, useEffect } from "react";
import MapSearch from "./MapSearch";
import supabase from "../supaBaseClient";

export default function NewPostForm({ onPostSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [location, setLocation] = useState(null); // Capture marker coordinates

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !imageFile) {
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

      //IMAGE FILE
      const filePath = `public/${Date.now()}_${imageFile.name}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from("uploads")
        .upload(filePath, imageFile);

      if (fileError) {
        console.error("Error uploading file:", fileError);
        return;
      }

      const imageUrl = `${
        supabase.storage.from("uploads").getPublicUrl(filePath).data.publicUrl
      }`;

      const { data: userData, error: userQueryError } = await supabase
        .from("Users")
        .select("*")
        .eq("user_id", user.id) // Assuming `auth_user_id` links `Users` to `auth.users`
        .single();

      if (userQueryError) {
        console.error("Error fetching user data:", userQueryError);
        return;
      }

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
        setImageFile(null);
        setLocation(null);

        onPostSubmit();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div id="newpost-form">
      <h1 id="newpost-form-DROP-A-PIN">Drop a Pin!</h1>
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
          <label htmlFor="imageFile">Upload Image:</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <br />

        <div>
          <MapSearch onLocationChange={setLocation} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
