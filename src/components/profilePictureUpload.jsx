import React from "react";

const profilePictureUpload = () => {
  return (
    <div>
      {" "}
      <div>
        <label htmlFor="imageFile">Upload Image:</label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default profilePictureUpload;
