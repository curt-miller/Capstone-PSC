import React from "react";
import { useNavigate } from "react-router-dom";
import pinpalslogo from "../assets/PinPalsLogo.png";
import supabase from "../supaBaseClient";

const Nav = ({ setUserId }) => {
  const navigate = useNavigate();


  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("displayName");

    if (setUserId) {
      setUserId(null);
    } else {
      console.error("setUserId is not passed correctly.");
    }
    await supabase.auth.signOut();
    navigate("/login");
  };

  const authToken = localStorage.getItem("authToken");
  const displayName = localStorage.getItem("displayName");

  return (
    <div className="navContainer">
      <img
        src={pinpalslogo}
        alt="site_logo"
        className="navLogo"
        onClick={() => navigate("/")}
      />
      {authToken && <p>Welcome Back, {displayName}</p>}
      <div className="navButtons">
        {!authToken ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/userpage")}>Profile</button>
            {/* remove country button before final - functionality by clicking image */}
            <button onClick={() => navigate("/afghanistan")}>Country</button>
            {/* remove attraction button before final - functionality by clicking on attraction */}
            <button onClick={() => navigate("/attractiondetail")}>
              Attraction
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
