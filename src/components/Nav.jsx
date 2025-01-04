import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/register");
  };
  return (
    <div className="navContainer">
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default Nav;
