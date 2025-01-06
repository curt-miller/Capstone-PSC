const router = require("express").Router();
const prisma = require("../../prisma");
const bcrypt = require("bcrypt");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "username and password are required." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma-specific error for unique constraint violation
      res.status(400).json({ error: "Username is already taken." });
    } else {
      next(error);
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
