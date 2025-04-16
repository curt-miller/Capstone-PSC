import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import supabase from "../supaBaseClient";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Login = ({ setUserId }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const defaultPhoto =
    "https://wagtwrwcrjgunioswvkr.supabase.co/storage/v1/object/public/profile-pictures/public/profile%20picture.jpg";

  localStorage.setItem("defaultPhoto", defaultPhoto);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (session) {
          // If a session exists, redirect to the homepage
          navigate("/");
        }
      }
    };

    checkUserSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setError("Email and Password Required");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
        return;
      }
      const { user } = data;
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (userError) {
        setError("Could not fetch user data. Please try again.");
        console.error(userError);
        return;
      }
      setUserId(userData.id);
      const displayName = user?.user_metadata?.display_name || "Guest";

      // Save token in localStorage or cookie
      localStorage.setItem("authToken", data.session.access_token);
      localStorage.setItem("displayName", displayName);
      localStorage.setItem("userId", userData.id);
      setError(null);
      // Redirect to the homepage
      navigate("/");
    } catch (error) {
      console.error("Error during login", error);
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("Users").select();

      if (error) {
        setError("Could not fetch Users");
        setEmail(null);
        console.log(error);
      }
      if (data) {
        setEmail("");
        setPassword("");
        setError(null);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="login-page-container">
        <Nav />
        <div className="login">
          <h1>LOGIN</h1>
          <form className="formContainer" onSubmit={handleSubmit}>
            <div className="inputs">
              <label htmlFor="email">Email: </label>
              <input type="text" name="email" placeholder="JohnDoe" />
            </div>
            <div className="inputs">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                name="password"
                placeholder="Please enter a password"
              />
            </div>
            <div>
              <button className="largeButton" type="submit">
                Submit
              </button>
            </div>
            {error && <p>{error}</p>}
          </form>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <br />
          <p>If you don't have an account with us:</p>
          <button className="largeButton" onClick={() => navigate("/register")}>
            Register here
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
