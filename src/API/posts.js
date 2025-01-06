const router = require("express").Router();
module.exports = router;
const prisma = require("../../prisma");

router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});
