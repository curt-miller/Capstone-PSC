import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  return (
    <div>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        {/* Registration Route */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
