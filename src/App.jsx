import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NewPostForm from "./components/NewPostForm";
import MapMarkers from "./components/MapMarkers";
import { useState } from "react";
import UserPage from "./components/UserPage";
import CountriesPage from "./components/CountriesPage";

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState({});

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
        <Route path="/userpage" element={<UserPage />} />
        <Route
          path="/:countryname"
          element={<CountriesPage setCountry={setCountry} country={country} />}
        />
      </Routes>
    </div>
  );
}
