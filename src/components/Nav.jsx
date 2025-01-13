import React from "react";
import { useNavigate } from "react-router-dom";
import pinpalslogo from "../assets/PinPalsLogo.png";

const Nav = () => {
  const navigate = useNavigate();
  const displayName = localStorage.getItem("displayName");
  return (
    <div className="navContainer">
      <img
        src={pinpalslogo}
        alt="site_logo"
        className="navLogo"
        onClick={() => navigate("/")}
      />
      <p>Welcome Back, {displayName}</p>
      <div className="navButtons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/userpage")}>Profile</button>
        {/* remove country button before final - functionality by clicking image */}
        <button onClick={() => navigate("/afghanistan")}>Country</button>
        {/* remove attraction button before final - functionality by clicking on attraction */}
        <button onClick={() => navigate("/attractiondetail")}>
          Attraction
        </button>
      </div>
    </div>
  );
};

export default Nav;
