import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  return (
    <div className="navContainer">
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
      <button onClick={() => navigate("/userpage")}>Profile</button>
      <button onClick={() => navigate("/afghanistan")}>Country (temporary)</button>
      <button onClick={() => navigate("/attractiondetail")}>Attraction Detail</button>
    </div>
  );
};

export default Nav;
