import React, { useState } from "react";
import supabase from "../supaBaseClient";
import Nav from "./Nav";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const UserSettings = () => {
  const userId = localStorage.getItem("userId") || "Guest";
  const storedDisplayName = localStorage.getItem("displayName") || "Anonymous";

  const [displayName, setDisplayName] = useState(storedDisplayName);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileName = `public/${userId}-${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload profile picture.");
        return;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error getting public URL:", urlError);
        alert("Failed to retrieve public URL for profile picture.");
        return;
      }

      setProfilePictureUrl(urlData.publicUrl);
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const updateFields = {
        display_name: displayName,
      };

      if (profilePictureUrl) {
        updateFields.profilePicture = profilePictureUrl;
      }

      const { data, error } = await supabase
        .from("Users")
        .update(updateFields)
        .eq("id", userId);

      if (error) {
        console.error("Error saving settings:", error);
        alert("Failed to save settings. Please try again.");
        return;
      }

      localStorage.setItem("displayName", displayName);
      alert("Settings saved!");
    } catch (err) {
      console.error("Unexpected error while saving settings:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="settings-page-container">
        <Nav />
        <div className="settings">
          <h1>User Settings</h1>
          <div className="settings-info">
            <Typography variant="subtitle1">
              <strong>Current Display Name:</strong> {storedDisplayName}
            </Typography>
          </div>
          <div className="settings-form">
            <label htmlFor="displayName">
              <strong>Update Display Name:</strong>
            </label>
            <input
              type="text"
              id="displayName"
              className=""
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder="Enter your new display name"
            />
            <br />
            <label htmlFor="profilePicture">
              <strong>Upload Profile Picture:</strong>
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureUpload}
            />
            {uploading && <p>Uploading...</p>}
            {profilePictureUrl && (
              <div>
                <p>
                  <strong>Preview:</strong>
                </p>
                <img
                  src={profilePictureUrl}
                  alt="Profile Preview"
                  style={{ maxWidth: "100%", borderRadius: "10px" }}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            className="save-button"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
