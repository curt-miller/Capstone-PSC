import { useState } from "react";
import supabase from "../config/supabaseClient";
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

    const { data, error } = await supabase
      .from("Users")
      .insert([{ username, password }])
      .select();

    if (error) {
      console.log(error);
      setError("Registration failed. Please try again.");
    }
    if (data) {
      console.log(data);
      setError(null);
      setUsername("");
      setPassword("");
      navigate("/login");
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