// Api route(`baseUrl/api/register`)
const express = require("express");
const app = express();
const router = express.Router();

const loginController = require("../../../controllers/loginController");

// Change the routes to post
router.get("/verifyemail", loginController.sendOTP);

module.exports = router;
