import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password Required");
      return;
    }
    try {
      const { data: user, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("username", username)
        .single();

      if (fetchError) {
        console.error(fetchError);
        setError("Invalid username or password");
        return;
      }

      if (user.password !== password) {
        setError("Invalid username or password");
        return;
      }

      setError(null);
      console.log("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Error during login", error);
      setError("Something went wrong. Please try again.");
    }
  };
  return (
    <>
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
    </>
  );
};

export default Login;
