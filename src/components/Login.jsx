import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchLogin = async (username, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }
    const data = await response.json();
    return { token: data.token, userId: data.userId };
  } catch (error) {
    console.error("Error fething users:", error);
    throw error;
  }
};

const Login = ({ setUsername, setToken }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, userId } = await fetchLogin(username, password);
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userId);
        setToken(token);
        setUsername(username);
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred. Please try again later.");
    }
  };
  return (
    <>
      <div className="login">
        <p>UserName</p>
        <input
          type="text"
          required
          onChange={(e) => setUserName(e.target.value)}
          placeholder="JohnDoe"
        />
        <p>Password</p>
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Please enter a password"
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default Login;
