const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const supabase = require("./config/supabaseClient");

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "username and password are required." });
    }

    const { data: user, error } = await supabase.auth.signUp({
      email: username,
      password: password
    });

    if (error.message.includes("already registered")) {
      res.status(400).json({ error: "Username is already taken." });
    } else {
      throw error;
    }

    const { data: userProfile, error: profileError } = await supabase
      .from("Users")
      .insert([{ username }]);

    if (profileError) {
      return res
        .status(500)
        .json({ error: "User profile creation failed. Please try again." });
    }

    res.status(201).json({
      messasge: "User created successfully",
      user: { id: userProfile[0]?.id, username: userProfile[0]?.username }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    next(error); // Pass the error to the Express error handler
  }
});

module.exports = router;
