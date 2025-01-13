import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import supabase from "../supaBaseClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and Password Required");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
        return;
      }

      console.log("Login successful:", data);

      // Save token in localStorage or cookie
      localStorage.setItem("authToken", data.session.access_token);

      setError(null);
      console.log(data.session.access_token);
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
        setUsername(null);
        console.log(error);
      }
      if (data) {
        setUsername("");
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
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
        </div>
      </div>
    </>
  );
};

export default Login;
