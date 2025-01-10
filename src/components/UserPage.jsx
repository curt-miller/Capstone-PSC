import React from "react";
import NewPostForm from "./NewPostForm";
import Feed from "./Feed";
import { useState } from "react";
import Nav from "./Nav";

const UserPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);

  const handleRefresh = () => {
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="user-profile-page-container">
      <Nav />
      <NewPostForm onPostSubmit={handleRefresh} />
      <Feed refreshPosts={refreshPosts} />
    </div>
  );
};

export default UserPage;
