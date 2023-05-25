const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { User } = require("../model/Model");

/*

************************  Members allowed APIs *********************

*/

exports.getMe = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.getUserById(id);
    delete user.password;

    res.status(200).json({
      status: "success",
      message: "Get user by Id",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const id = req.user.id;
    const cols = req.body;

    if (cols.password) {
      return res.status(400).json({
        status: "fail",
        message:
          "This route is not for password update. Please use /updatePassword'",
      });
    }

    if (cols.role) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    await User.updateUser(id, cols);
    const updatedUser = await User.getUserById(id);
    delete updatedUser.password;
    res.status(200).json({
      status: "success",
      message: "User updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    const id = req.user.id;
    await User.deleteUser(id);

    res.status(200).json({
      status: "success",
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

/*

************************  Admin only APIs *********************

*/

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      status: "success",
      message: "Get all users",
      length: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //encrypt password before store into DB
    const hashPassword = await bcrypt.hash(password, 10);
    await User.createUser(email, hashPassword);

    res.status(200).json({
      status: "success",
      message: "User created!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    delete user.password;

    res.status(200).json({
      status: "success",
      message: "Get user by Id",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const cols = req.body;

    if (cols.password) {
      return res.status(400).json({
        status: "fail",
        message:
          "This route is not for password update. Please use /updatePassword'",
      });
    }

    await User.updateUser(id, cols);
    const updatedUser = await User.getUserById(id);
    delete updatedUser.password;

    res.status(200).json({
      status: "success",
      message: "User updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.deleteUser(id);

    res.status(200).json({
      status: "success",
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
