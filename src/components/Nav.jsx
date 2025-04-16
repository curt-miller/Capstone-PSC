import React from "react";
import { useNavigate } from "react-router-dom";
import pinpalslogo from "../assets/PinPalsLogo.png";
import supabase from "../supaBaseClient";

const Nav = ({ setUserId }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userId");
    localStorage.removeItem("profileId");

    if (setUserId) {
      setUserId(null);
    } else {
      console.error("setUserId is not passed correctly.");
    }
    await supabase.auth.signOut();
    navigate("/login");
  };

  const authToken = localStorage.getItem("authToken");

  return (
    <div className="navContainer">
      <img
        src={pinpalslogo}
        alt="site_logo"
        className="navLogo"
        onClick={() => navigate("/")}
      />
      <div className="navButtons">
        {!authToken ? (
          <>
            <button className="baseButton" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="baseButton"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button className="baseButton" onClick={() => navigate("/")}>
              Home
            </button>
            <button
              className="baseButton"
              onClick={() => navigate("/userpage")}
            >
              Profile
            </button>
            <button className="baseButton" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
