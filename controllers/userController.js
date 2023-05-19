// Require the User model
const user = require("../model/user");

// Require the Login Info model
const userLoginInfo = require("../model/loginInfo");

/*
Register a User Action (async function)

1. Check if the User already exists

2. Create a New User(Take the Input Name and email)

*/

module.exports.register = async (req, res) => {
  let { email, name } = req.body;

  try {
    let isUserAlreadyregisterd = await user.findOne({
      email: email,
    });

    /*If user is already present send the same info back to FE */

    console.log(isUserAlreadyregisterd);

    if (isUserAlreadyregisterd) {
      return res.status(200).json({
        message: "User is Already Registered. Please Login",
        data: [],
      });
    }

    /* Create a new User */

    let newUserCreated = await user.create(req.body);

    if (newUserCreated) {
      return res.status(200).json({
        message:
          "User Registered Succesfully. Please Login with UserName and OTP",
        data: {
          userName: email,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
