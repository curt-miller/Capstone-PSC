import React from "react";
import NewPostForm from "./NewPostForm";
import Feed from "./Feed";
import Nav from "./Nav";

const UserPage = () => {
  return (
    <div>
      <Nav/>
      <NewPostForm />
      <Feed />
    </div>
  );
};

export default UserPage;
