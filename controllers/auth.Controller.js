const User = require("../models/user.Model");
const validator = require("validator");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;

    if (!fullname || !email || !password || !phone) {
      throw new Error("Must fill name, email and password");
    }

    //check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // throw
      throw new Error("User already exists");
    }
    if (!validator.isEmail(email)) {
      throw new Error("invalid email");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password must 8+ charm contains uppercase lowercase, number and special char"
      );
    }
    // salt
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hash = await bcrypt.hash(password, salt);
    // create the user
    const user = await User.create({
      fullname,
      email,
      password: hash,
      phone,
    });
    const token = generateToken(user?._id);
    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Must  fill email and password");
    }

    // find the user in db by email only
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Incorrect email or password");
    }

    const token = generateToken(user?._id);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
};
