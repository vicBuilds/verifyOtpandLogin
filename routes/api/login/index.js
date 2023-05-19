// Api route(`baseUrl/api/register`)

const express = require("express");

const app = express();

const router = express.Router();

router.get("/", (req, res) => {
  //   console.log("I was here");
  res.send("Ok I am Working");
});

module.exports = router;
