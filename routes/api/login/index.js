// Api route(`baseUrl/api/register`)
const express = require("express");
const app = express();
const router = express.Router();

const loginController = require("../../../controllers/loginController");

// Change the routes to post

// Send the OTP to mailId
router.get("/verifyemail", loginController.sendOTP);

// Verify the OTP
router.post("/verifyotp", loginController.verifyOTP);

module.exports = router;
