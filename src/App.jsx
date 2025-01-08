import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NewPostForm from "./components/NewPostForm";
import MapMarkers from "./components/MapMarkers";
import { useState } from "react";

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  return (
    <div>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        {/* Login Route */}
        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
              setUsername={setUsername}
              username={username}
            />
          }
        />
        {/* Registration Route */}
        <Route path="/register" element={<Register />} />
        <Route path="/NewPost" element={<NewPostForm />} />
        <Route path="/Markers" element={<MapMarkers />} />
      </Routes>
    </div>
  );
}
