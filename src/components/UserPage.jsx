import React from "react";
import NewPostForm from "./NewPostForm";
import Feed from "./Feed";
import { useState } from "react";
import Nav from "./Nav";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const userId = localStorage.getItem("userId");
  console.log("USERID USERPAGE: ", userId.userId);
  const handleRefresh = () => {
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="user-profile-page-container">
      <Nav />
      <div className="user-profile-page-content">
        <div className="new-post-form-container">
          <NewPostForm onPostSubmit={handleRefresh} />
        </div>
        <div className="feed-container">
          <Feed refreshPosts={refreshPosts} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
