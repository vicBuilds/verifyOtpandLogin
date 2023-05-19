// Api route(`baseUrl/api/register`)
const express = require("express");
const app = express();
const router = express.Router();

const loginController = require("../../../controllers/loginController");

// Change the routes to post

// Send the OTP to mailId
router.get("/sendotp", loginController.sendOTP);

// Verify the OTP
router.post("/verifyemail", loginController.verifyOTP);

module.exports = router;
