const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
