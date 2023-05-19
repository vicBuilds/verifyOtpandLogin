const mongoose = require("mongoose");

const loginInfoSchema = new mongoose.Schema(
  {
    /*Email of the User for whom Login is being attempted*/
    email: {
      type: String,
      required: true,
    },

    /*Save the current OTP in the user who is trying to Login schema*/
    currentOtp: {
      type: Number,
    },

    /*To limit the wrongattempts to max 5*/
    wrongLoginAttemptCount: {
      type: Number,
    },
    /*Block the User for 1 Hour if five wrong attempts are made*/
    lastBlockedTime: {
      type: Number,
    },

    /* If the Users account is currently blocked tell the user to attempt after */
    isAccountBlocked: {
      type: Boolean,
    },

    /*To track the validity of an OTP(OTP is valid for 5 mins only)*/
    otpGeneratedTime: {
      type: Number,
    },
  },

  {
    timestamps: true,
  }
);

const AccountLoginInfo = mongoose.model("accountLoginInfo", loginInfoSchema);

module.exports = AccountLoginInfo;
