import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

function Register() {
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
      const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        }
      );

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "Registration failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("User registered:", data);
      setError(null);
      setUsername("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="register-page-container">
        <Nav />
        <div className="register">
          <h1>REGISTER</h1>
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
}

export default Register;
