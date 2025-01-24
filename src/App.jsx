import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NewPostForm from "./components/NewPostForm";
import UserPage from "./components/UserPage";
import CountriesPage from "./components/CountriesPage";
import AttractionDetail from "./components/AttractionDetail";
import ImageGrid from "./components/ImageGrid";
import UserSettings from "./components/UserSettings";
import UserProfile from "./components/UserProfile";

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState(() => {
    // Initialize country state from localStorage if available
    const storedCountry = localStorage.getItem("country");
    return storedCountry ? { name: storedCountry } : {}; // Default to empty if not found
  });
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [userId, setUserId] = useState(null);

  // Effect to update localStorage when country changes
  useEffect(() => {
    if (country.name) {
      localStorage.setItem("country", country.name);
    }
  }, [country]);

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
          element={
            <UserPage
              refreshPosts={refreshPosts}
              userId={userId}
              setCountry={setCountry}
            />
          }
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
        <Route path="/attraction/:id" element={<AttractionDetail />} />
        <Route path="/imagegrid" element={<ImageGrid />} />
        <Route path="/:userId/settings" element={<UserSettings />} />
        <Route path="/:userId/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}
