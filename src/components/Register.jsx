import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Nav from "./Nav";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setError("email, username, and Password Required");
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username
          }
        }
      });

      if (signUpError) {
        setError(
          signUpError.message || "Registration failed. Please try again."
        );
        return;
      }

      console.log("User registered:", data.user);
      setError(null);
      setEmail("");
      setPassword("");
      setUsername("");
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
              placeholder="Enter a username"
            />
            <br />
            <br />
            <label htmlFor="email">email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
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
