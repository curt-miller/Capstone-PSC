const router = require("express").Router();
const jwt = require("jsonwebtoken"); // Ensure you've installed this package
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT Secret Key (Store this in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  // Validate input
  console.log("username:password", username, ",", password);
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Fetch user by username
    const { data: user, error } = await supabase
      .from("Users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = router;
