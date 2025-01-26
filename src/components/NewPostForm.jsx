import React, { useState } from "react";
import MapSearch from "./MapSearch";
import supabase from "../supaBaseClient";
import * as exifr from "exifr";

export default function NewPostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [imgCoords, setImgCoords] = useState(null);
  const [location, setLocation] = useState(null);

  const userId = localStorage.getItem("userId");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      try {
        const metadata = await exifr.parse(file, { gps: true });
        if (metadata && metadata.latitude && metadata.longitude) {
          const coords = {
            lat: metadata.latitude,
            lng: metadata.longitude,
          };
          setImgCoords(coords); // Updates imgCoords without affecting form re-render
          console.log("Coords as object", coords);
        } else {
          console.log("No GPS data found in the image.");
        }
      } catch (error) {
        console.error("Error extracting EXIF data:", error);
      }
    }
  };

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
        error: userError,
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
        .eq("user_id", user.id)
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
          coordinates: location.coordinates,
          user_id: userData.id,
        },
      ]);
      if (error) {
        console.error("Error inserting post:", error);
      } else {
        console.log("Post added successfully:", data);
        setTitle("");
        setDescription("");
        setImageFile(null);
        setCoordinates(null);
        setLocation(null);
        alert("Pin Dropped!");
        window.location.reload();
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
            maxLength={100}
            placeholder="100 characters max"
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
            onChange={handleFileChange}
          />
        </div>
        <br />

        <div>
          <MapSearch onLocationChange={setLocation} imgCoords={imgCoords} />
        </div>

        {/* Conditional rendering based on userId */}
        {userId ? (
          <button type="submit">Submit</button>
        ) : (
          <p className="new_post_please_login">Please login to drop a pin!</p>
        )}
      </form>
    </div>
  );
}
