const nodemailer = require("nodemailer");
let jwt = require("jsonwebtoken");

// Require the User model
const user = require("../model/user");
// Require the Login Info model
const userLoginInfo = require("../model/loginInfo");
// Require the user
const userModel = require("../model/user");

const utils = require("../utils/index");

require("dotenv").config();

/* Function to generate random 7 digit number(FOR OTP) */
const getrandomNumber = () => {
  const min = 1000000; // Minimum 7-digit number (inclusive)
  const max = 9999999; // Maximum 7-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
Send OTP Controller Action (Logic explained below):
1. Check if the User is registered or not.
2. If the user is not registered send the info to register the user first
3. If user is registered do the following:
  a. Find the login info for the user.
  b. If loginInfo exists check whether the account is blocked or not
  c. If Account is not blocked update the generated otp and time
  d. If noLogin info is found(means the user is logging in for the first time) create a new one.
  e. Send the OTP via mail to the receipient
  f. Send relevant response to FE
*/

module.exports.sendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    let isUserRegistered = await user.findOne({
      email: email,
    });

    // Unbound user. Unregistered User
    if (!isUserRegistered) {
      return res.status(400).json({
        message: "User is not registered. Please register first before Login",
      });
    }

    // Search for the mail in the the login info and check for the login info the user
    let userinfo = await userLoginInfo.findOne({
      email: email,
    });

    //Generate OTP
    const otp = await getrandomNumber();

    // if info exists then update the OTP and otp generatedtime
    if (userinfo) {
      if (userinfo.isAccountBlocked) {
        return res.status(400).json({
          message: `Account is blocked. Don't try to regenrate OTP`,
          data: [],
        });
      }
      userinfo.currentOtp = otp;
      userinfo.otpGeneratedTime = Date.now();
      await userinfo.save();
    }
    // if info doesn't exists then create one
    else {
      await userLoginInfo.create({
        email,
        currentOtp: otp,
        otpGeneratedTime: Date.now(),
        wrongLoginAttemptCount: 0,
      });
    }

    // Send Mail to the receipient with OTP
    let ismailSent = await utils.sendMail(email, otp, isUserRegistered);

    //Send Relevant status back

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

/*
Send OTP Controller Action (Logic explained below):

1. Check if the User is registered or not.

2. Find the Login info with the user's email

3. Check if the User's account is currently locked or not.

4. If user's account is not locked check if otp matches or not

5. If OTP doesn't match:
  a. Increase the wrong attempt count.
  b. If the wrong attempt count >5, lock the account.
  

5. If the OTP match:
  a. Check if the OTP has expired or not.
  b. If the OTP has not expired create a token and sent to the User
  c. Change the OTP to a value less than 0 so that it can't be reused
  d. send relevant response. 
*/

module.exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    // Check if the user is registered or not

    let userinfo = await userLoginInfo.findOne({
      email: email,
    });

    if (!userinfo) {
      return res.status(400).json({
        message: "Unauthorized. Check Credentials",
      });
    }

    // If the Account is blocked it should be blocked for 1 hour

    if (userinfo.isAccountBlocked && userinfo.lastBlockedTime) {
      let timegap = Date.now() - userinfo.lastBlockedTime;
      timegap = timegap / (1000 * 60 * 60);

      let accountUnlockTime = new Date(
        userinfo.lastBlockedTime + 1000 * 60 * 60
      );

      //   Check if the time for the blocking of the account has surpassed by one hour or not
      if (timegap < 1) {
        return res.status(403).json({
          message: `Maximum No of Wrong Attempts Exhausted. Account is Locked untill ${accountUnlockTime}`,
        });
      }
    }

    //Reseting the userinfo.isAccountBlocked after 1 hour if the user again tries to login after one hour

    userinfo.isAccountBlocked = false;
    await userinfo.save();

    // Check minutes elapsed after the last otp generated time
    let minutes = (Date.now() - userinfo.otpGeneratedTime) / (1000 * 60);

    /* As after a succesfull login we are setting the otp to a random value<0, 
       so we are redirecting the user to generate a new one
    */
    if (userinfo.currentOtp < 0) {
      return res.status(400).json({
        message: "OTP EXPIRED. Please generate a new one",
      });
    }

    //1. OTP DOES NOT MATCH

    if (otp != userinfo.currentOtp) {
      // if the property doesn't exist set it to zero
      let count = userinfo.wrongLoginAttemptCount;

      if (count > 4) {
        let currentTime = Date.now();
        userinfo.isAccountBlocked = true;
        userinfo.lastBlockedTime = currentTime;
        userinfo.wrongLoginAttemptCount = 0;

        await userinfo.save();
        return res.status(403).json({
          message: `Wrong OTP. Maximum No of Wrong Attempts Exhausted. Please try after ${new Date(
            currentTime + 1000 * 60 * 60
          )}`,
        });
      }

      userinfo.wrongLoginAttemptCount = count + 1;
      await userinfo.save();
      return res.status(403).json({
        message: `Wrong OTP. Attempts Left ${
          5 - userinfo.wrongLoginAttemptCount
        }`,
      });
    }

    //OTP MATCHES

    if (minutes > 5) {
      return res.status(400).json({
        message: "OTP EXPIRED. Please generate a new one",
      });
    }

    if (!userinfo.otpGeneratedTime) {
      userinfo.otpGeneratedTime = Date.now();
      await userinfo.save();
    }

    // userinfo.otpGeneratedTime = Date.now();
    // userinfo.email = email;
    userinfo.wrongLoginAttemptCount = 0;
    userinfo.currentOtp = Math.random();
    await userinfo.save();

    return res.status(200).json({
      message: "Login Successfull. Please have the token",
      data: {
        // Function of jwt please find from jwt web token documentation.
        // Encrypting the  userinfo using the key
        token: jwt.sign(
          userinfo.toJSON(),
          "secret@qwervddrw123/7e8wwqwecfe1/4",
          {
            expiresIn: "10000000",
          }
        ),
      },
    });
  } catch (err) {
    console.log("Eror is ", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
