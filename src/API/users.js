const express = require("express");
const router = express.Router();
const supabase = require("./config/supabaseClient");

router.post("/", async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Email is required." });
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
