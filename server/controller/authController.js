const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../model/Model");
const dotenv = require("dotenv");
dotenv.config();

//Create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Send JWT token in response cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  //remove the password in the output
  delete user.password;

  res.status(statusCode).json({
    status: "success",
    token,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password, dob, sex, height, weight } = req.body;
    console.log(req.body);

    //check if user already exists
    let user = await User.getUserByEmail(email);
    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }

    //encrypt password before store into DB
    const hashPassword = await bcrypt.hash(password, 10);
    await User.createUser(email, hashPassword);

    user = await User.getUserByEmail(email);
    await User.updateUser(user.id, { dob, sex, height, weight });

    // TODO send email for verification

    //send session token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1 Check email and pw exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    //2 Check if the user exist and Check if the password is correct
    const user = await User.getUserByEmail(email);

    if (!user || !(await checkPassword(password, user.password))) {
      return res.status(400).json({
        status: "401",
        message: "Incorrect email or password",
      });
    }

    //3 If everything ok , send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "success", message: "Log out successfully" });
};

exports.isLoggedIn = async (req, res, next) => {
  // 1) Verify the token
  try {
    // 1) Get the token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      // authen users also by req.cookies send via browser not just req.header
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(200).json({
        status: "fail",
        message: "You are not logged in!",
      });
    }

    //2) Validate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

    //3 Check if the user still exists
    const currentUser = await User.getUserById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist",
      });
    }

    //There is logged in user
    delete currentUser.password;
    // Grand Access
    res.status(200).json({
      status: "success",
      user: currentUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//Secure APIs, which requires Auth
exports.protect = async (req, res, next) => {
  try {
    // 1) Get the token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      // authen users also by req.cookies send via browser not just req.header
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in!",
      });
    }

    //2) Validate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

    //3 Check if the user still exists
    const currentUser = await User.getUserById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist",
      });
    }

    req.user = currentUser;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: error,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }

    //Grand access
    next();
  };
};

exports.updatePassword = async (req, res, next) => {
  try {
    //1 Get user from the DB
    const user = await User.getUserById(req.user.id);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User doesn't exist",
      });
    }

    const currentPassword = req.body.currentPassword;
    const dbPassword = user.password;
    const newPassword = req.body.newPassword;

    //2 Check if POSTed password is correct
    if (!(await checkPassword(currentPassword, dbPassword))) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect passsword",
      });
    }

    //3 If the is correct, update the password
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashPassword);

    //4 Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

const checkPassword = async function (inputPassword, currentPassword) {
  try {
    return await bcrypt.compare(inputPassword, currentPassword);
  } catch (error) {
    return false;
  }
};
