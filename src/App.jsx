import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NewPostForm from "./components/NewPostForm";
import MapMarkers from "./components/MapMarkers";
import UserPage from "./components/UserPage";
import CountriesPage from "./components/CountriesPage";
import AttractionDetail from "./components/AttractionDetail";
import ImageGrid from "./components/ImageGrid";
import UserSettings from "./components/UserSettings";

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState({});
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <div>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <Home
              setCountry={setCountry}
              country={country}
              setUserId={setUserId}
              userId={userId}
            />
          }
        />
        {/* Login Route */}
        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
              setUsername={setUsername}
              username={username}
              setUserId={setUserId}
            />
          }
        />
        {/* Registration Route */}
        <Route path="/register" element={<Register />} />
        <Route path="/NewPost" element={<NewPostForm />} />
        <Route
          path="/userpage"
          element={<UserPage refreshPosts={refreshPosts} userId={userId} />}
        />
        {/* Country Route */}
        <Route
          path="/:countryname"
          element={
            <CountriesPage
              setCountry={setCountry}
              country={country}
              refreshPosts={refreshPosts}
            />
          }
        />
        <Route path="/Markers" element={<MapMarkers />} />{" "}
        {/* just for testing */}
        <Route path="/attraction/:id" element={<AttractionDetail />} />
        {/* just for testing */}
        <Route path="/imagegrid" element={<ImageGrid />} />
        <Route path="/:userId/settings" element={<UserSettings />} />
      </Routes>
    </div>
  );
}
