import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const handleHome = async (e) => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted");
  };

  return (
    <div className={"registerContainer"}>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text"></input>
        <label>Password</label>
        <input type="text"></input>
        <button>Submit</button>
      </form>
      <button onClick={handleHome}>Home</button>
    </div>
  );
};

export default Register;
