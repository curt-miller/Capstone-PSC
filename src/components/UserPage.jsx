import React from "react";
import NewPostForm from "./NewPostForm";
import Feed from "./Feed";
import { useState } from "react";
import Nav from "./Nav";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const displayName = localStorage.getItem("displayName");

  const handleRefresh = () => {
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="user-profile-page-container">
      <Nav />
      <p className="user-profile-welcome">Welcome Back, {displayName}</p>
      <div className="user-profile-page-content">
        <div className="new-post-form-container">
          <NewPostForm onPostSubmit={handleRefresh} />
        </div>
        <div className="feed-container">
        <h1 className="user-profile-page-YOUR-POSTS">Your Posts</h1>
          <Feed refreshPosts={refreshPosts} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
