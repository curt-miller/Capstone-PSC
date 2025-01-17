import React, { useState } from "react";
import supabase from "../supaBaseClient";
import Nav from "./Nav";

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
    const file = e.target.files[0]; // Get the file directly from the event
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

      console.log(urlData.publicUrl);

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
        display_name: displayName
      };

      if (profilePictureUrl) {
        updateFields.profilePicture = profilePictureUrl;
      }

      const { data, error } = await supabase
        .from("Users")
        .update(updateFields)
        .eq("id", userId);

      if (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to save settings. Please try again.");
        return;
      }

      localStorage.setItem("displayName", displayName);
      alert("Settings saved!");
    } catch (err) {
      console.error("Unexpected error while saving settings:", err);
      alert("An unexpected error occured. Please try again.");
    }
  };

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
        <h1>User Settings</h1>
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Current Display Name:</strong> {storedDisplayName}
          </p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Update Display Name:</strong>
            <input
              type="text"
              value={displayName}
              onChange={handleDisplayNameChange}
              style={{ marginLeft: "10px", padding: "5px", width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Upload Profile Picture:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              style={{ marginLeft: "10px" }}
            />
          </label>
          {profilePictureUrl && (
            <div style={{ marginTop: "20px" }}>
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
          onClick={handleSaveSettings}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
