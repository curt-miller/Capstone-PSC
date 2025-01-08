import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleProfile = () => {
    navigate("/userpage");
  };
  return (
    <div className="navContainer">
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleProfile}>Profile</button>
    </div>
  );
};

export default Nav;
