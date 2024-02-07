const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validator = require("validator");

const getSingleUser = asyncHandler(async (req, res) => {
  try {

    const id=req.userAuthId;

    const user = await User.findById(id);

    res.status(200).json({
      status: "success",
      message: "User fetch Successfully",
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  try {

    const id=req.userAuthId;

    const { fullname, email, phone } = req.body;

    if (!fullname || !email || !phone) {
      throw new Error("Must fill name, email ");
    }

    if (!validator.isEmail(email)) {
      throw new Error("invalid email");
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        fullname,
        email,
        phone,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "User updated Successfully",
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
});

const deleteUser=asyncHandler(async(req,res)=>{
  try {
    const id = req.userAuthId;
    const user = await User.findByIdAndDelete({ _id: id });
    res.json({
      msg: " user delete successfully",
      user,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      msg: error.message,
    });
  }
})


// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
    res.json({
      msg: "All users fetch successfully",
      users,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      msg: error.message,
    });
  }
});

module.exports = {
  getAllUsers,
  updateUser,
  getSingleUser,
  deleteUser
};
