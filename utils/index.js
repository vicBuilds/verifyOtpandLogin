// Basic Config for Nodemailer with Gmail and util function for sending OTP to a recepient

const nodemailer = require("nodemailer");

module.exports.sendMail = async (receipientMail, otp, isUserRegistered) => {
  try {
    let email = receipientMail;
    let testAccount = await nodemailer.createTestAccount();

    /* Create transporter */
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.Nodemail_PASSWORD,
      },
    });

    /*Send Mail */
    let info = await transporter.sendMail({
      from: "noreply@app.com", // sender address
      to: `${email}`, // list of receivers
      subject: "OTP FOR LOGIN✔", // Subject line
      text: `OTP FOR USER ${email}`, // plain text body
      html: `<div>
      <h3>Hello ${isUserRegistered.name}, <br><br> The OTP for Login is
      ${otp}. Please remember the OTP is valid for 5mins only.<br>
      <br>
      Regards,<br>
      App Login Team
      </h3>
      <br><br>
      <sub>This is a system generated mail. Please don't reply</sub>
      </div>`, // html body
    });
    return info;
  } catch (err) {
    console.log("Error in sending mail", err);
    return;
  }
};
