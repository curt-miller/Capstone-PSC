import React from "react";
import { useNavigate } from "react-router-dom";
import pinpalslogo from "../assets/PinPalsLogo.png";

const Nav = () => {
  const navigate = useNavigate();

  return (
    <div className="navContainer">
      <img
        src={pinpalslogo}
        alt="site_logo"
        className="navLogo"
        onClick={() => navigate("/")}
      />
      <div className="navButtons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/userpage")}>Profile</button>
      </div>
    </div>
  );
};

export default Nav;
