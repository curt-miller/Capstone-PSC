import React from "react";
import NewPostForm from "./NewPostForm";
import Feed from "./Feed";
import { useState } from "react";
import Nav from "./Nav";
import profilePictureUpload from "./profilePictureUpload";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);

  const userId = localStorage.getItem("userId");
  const displayName = localStorage.getItem("displayName");

  const handleRefresh = () => {
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="user-profile-page-container">
      <Nav />
      <div className="user-profile-page-content">
        <div className="user-profile-welcome">
          <p>Welcome Back, {displayName}</p>
          <profilePictureUpload />
        </div>
        <div className="new-post-form-container">
          <NewPostForm onPostSubmit={handleRefresh} />
        </div>
        <div className="feed-container">
          <h1 className="user-profile-page-YOUR-POSTS">Your Posts</h1>
          <Feed refreshPosts={refreshPosts} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
