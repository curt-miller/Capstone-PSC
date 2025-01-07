import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ success: "", error: null });
  const navigate = useNavigate();

  const handleHome = async (e) => {
    navigate("/");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted");
    try {
      const response = await fetch("http://localhost:3000/API/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to submit to post.");
      setMessage({ success: result.message, error: null });
      setFormData({ username: "", password: "" });
      navigate("/");
    } catch (error) {
      setMessage({ success: "", error: error.message });
    }
  }

  return (
    <div className={"registerContainer"}>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          required
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          type="text"
          placeholder="Username"
        ></input>
        <label>Password</label>
        <input
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          type="text"
          placeholder="Password"
        ></input>
        <button>Submit</button>
      </form>
      {message.success && <p>{message.success}</p>}
      {message.error && <p>{message.error}</p>}
      <button onClick={handleHome}>Home</button>
    </div>
  );
}

export default Register;
