const router = require("express").Router();
const prisma = require("../../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ensure you've installed this package

// JWT Secret Key (Store this in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username: username }
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token
    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
