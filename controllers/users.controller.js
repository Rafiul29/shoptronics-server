const User = require("../models/user.Model");
const validator = require("validator");
const bcrypt = require("bcrypt");
const asyncHandler=require("express-async-handler");
const { generateToken } = require("../utils/generateToken");
const { getTokenFromHeader } = require("../utils/getTokenFromHeader");
const {verifyToken}=require("../utils/verifyToken")

const registerUser = asyncHandler(async (req, res) => {
  try{
    const { fullname, email, password,phone} = req.body;

    if(!fullname||!email||!password || !phone){
      throw new Error("Must fill name, email and password")
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
    console.log(hash);
    // create the user
    const user = await User.create({
      fullname,
      email,
      password: hash,
      phone,
    });
    res.status(200).json({
      status: "success",
      message: "User registered Successfully",
      data: user,
    });

  }catch(error){
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
})

const loginUser = asyncHandler(async (req, res) => {
 
    const {email,password}=req.body;

    if(!email || !password){
      throw new Error("Must  fill email and password")
    }

// find the user in db by email only
    const userFound=await User.findOne({email})

    if(!userFound){
      throw new Error("Incorrect email or password");
    }

    const match=await bcrypt.compare(password,userFound.password);

    if(!match){
      throw new Error("Incorrect email or password");
    }

    res.status(201).json({
      status: "success",
      message: "User login Successfully",
      userFound,
      token:generateToken(userFound?._id)
    })
})


const getUserProfile=asyncHandler(async(req,res)=>{
const id=req.userAuthId
const user =await User.findById({_id:id})
  res.json({
    msg:"Welcome to profile page",
    user,
  })
})

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
