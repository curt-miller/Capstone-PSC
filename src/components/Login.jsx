import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import supabase from "../supaBaseClient";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const displayName = user?.user_metadata?.display_name || "Guest";

      // Save token in localStorage or cookie
      localStorage.setItem("authToken", data.session.access_token);
      localStorage.setItem("displayName", displayName);

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
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="JohnDoe"
            />
            <br />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please enter a password"
            />
            <br />
            <br />
            <button type="submit">Submit</button>
            {error && <p>{error}</p>}
          </form>
          <br />
          <br />
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <br />
          <p>If you don't have an account with us:</p>
          <Button
            variant="contained"
            color="primary"
            size="small" // Makes the button smaller
            onClick={() => navigate("/register")}
            sx={{ mt: 2, textTransform: "none" }} // Removes the uppercase text
          >
            Register here
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
