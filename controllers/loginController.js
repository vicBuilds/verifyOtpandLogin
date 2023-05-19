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
2. 

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
    /*GET A RANDOM SEVEN DIGIT OTP */

    // Sending mail.
    // let testAccount = await nodemailer.createTestAccount();

    // /* Create transporter */
    // const transporter = await nodemailer.createTransport({
    //   service: "gmail",
    //   host: "smtp.gmail.com",
    //   auth: {
    //     user: process.env.USER_EMAIL,
    //     pass: process.env.Nodemail_PASSWORD,
    //   },
    // });

    /*Send Mail */
    // let info = await transporter.sendMail({
    //   from: "noreply@app.com", // sender address
    //   to: `${email}`, // list of receivers
    //   subject: "OTP FOR LOGIN✔", // Subject line
    //   text: `OTP FOR USER ${email}`, // plain text body
    //   html: `<div>
    //   <h3>Hello ${isUserRegistered.name}, <br><br><br> The OTP for Login is
    //   ${otp}. Please remember the OTP is valid for 5mins only.<br>
    //   <br><br>
    //   Regards,<br>
    //   App Login Team
    //   </h3>
    //   <br><br>
    //   <sub>This is a system generated mail. Please don't reply</sub>
    //   </div>`, // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    await utils.sendMail(email, otp, isUserRegistered);

    return res.send("<h1>Working on this</h1>");
  } catch (err) {
    console.log("Eror is ", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
