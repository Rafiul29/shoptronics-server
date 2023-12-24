// external import
const express=require('express');

// internal import
const { registerUser,loginUser,getUserProfile} = require('../controllers/users.controller');
const isloggedIn=require("../middlewares/isLoggedIn")

//router
const router=express.Router();

// register an user
router.post("/register",registerUser)

//login an user
router.post('/login',loginUser);

// user profile
router.get("/profile",isloggedIn,getUserProfile)

module.exports=router;