const nodemailer = require("nodemailer");
// Require the User model
const user = require("../model/user");
// Require the Login Info model
const userLoginInfo = require("../model/loginInfo");

const utils = require("../utils/index");

require("dotenv").config();

/* Function to generate random 7 digit number */
const getrandomNumber = () => {
  const min = 1000000; // Minimum 7-digit number (inclusive)
  const max = 9999999; // Maximum 7-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
Send OTP Route:
1. Check if the User is registered or not.
2. If the user is not registered send the info to register the user first

*/

module.exports.sendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    let isUserRegistered = await user.findOne({
      email: email,
    });
    if (!isUserRegistered) {
      return res.status(400).json({
        message: "User is not registered. Please register first before Login",
      });
    }

    const otp = await getrandomNumber();
    let ismailSent = await utils.sendMail(email, otp, isUserRegistered);

    // Search for the mail in the the login info
    let userinfo = await userLoginInfo.findOne({
      email: email,
    });

    // if info exists then update the OTP and otp genratedtime
    if (userinfo) {
      userinfo.currentOtp = otp;
      userinfo.otpGeneratedTime = Date.now();
      await userinfo.save();
    }

    return res.status(200).json({
      message: `OTP Send to Mail ${email} and valid for 5 mins. Check your mail`,
      data: [],
    });
  } catch (err) {
    console.log("Eror is ", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
