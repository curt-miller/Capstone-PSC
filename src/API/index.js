const router = require("express").Router();
module.exports = router;
router.use("/users", require("./users"));

require("dotenv").config();

// Now you can access environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate the environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

// Create the Supabase client
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(supabaseUrl, supabaseKey);
