const express = require("express");
const app = express();

const router = express.Router();

router.use("/register", require("./register/index"));
router.use("/login", require("./login/index"));

module.exports = router;
