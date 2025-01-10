const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const loginRoute = require("./src/API/login");
app.use("/login", loginRoute);

// Your existing middleware and routes
app.use("https://wagtwrwcrjgunioswvkr.supabase.co", require("./src/API/index"));

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and Password are required." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Register the user with Supabase
    const { data, error } = await supabase
      .from("Users")
      .insert([{ username, password: hashedPassword }]);

    if (error) {
      return res.status(400).json({ error: "failed to register user." });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Other configurations
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
