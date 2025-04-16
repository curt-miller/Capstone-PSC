import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import supabase from "../supaBaseClient";
import Nav from "./Nav";

function Register() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const email = data.get("email");
    const password = data.get("password");
    const username = data.get("username");

    if (!email || !password || !username) {
      setError("email, username, and Password Required");
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              display_name: username
            }
          }
        }
      );

      if (signUpError) {
        throw signUpError;
      }

      if (authData?.user) {
        const userId = authData.user.id;
        const { error: insertError } = await supabase.from("Users").insert([
          {
            user_id: userId,
            display_name: username
          }
        ]);

        if (insertError) {
          console.error("Error inserting user into Users table:", insertError);
          setError(
            "Registration partially succeeded, but profile setup failed."
          );
          return;
        }

        setError(null);
        setEmail("");
        setPassword("");
        setUsername("");

        alert(
          "Registration successful! Please check your email to verify your account."
        );

        navigate("/login");
      }
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
          <form className="formContainer" onSubmit={handleSubmit}>
            <div className="inputs">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                name="username"
                placeholder="Enter a username"
              />
            </div>

            <div className="inputs">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
              />
            </div>

            <div className="inputs">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                name="password"
                placeholder="Please enter a password"
              />
            </div>

            <div className="formButtons">
              <Button sx={{ mt: 2, textTransform: "none" }} type="submit">
                Submit
              </Button>
            </div>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
