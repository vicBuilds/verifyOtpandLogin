const express = require("express");
const app = express();

const router = express.Router();

router.use("/api", require("./api/index"));

module.exports = router;
