// external import
const express=require('express');

// internal import
const {registerUser,loginUser} =require("../controllers/auth.Controller")

//router
const router=express.Router();

// register an user
router.post("/register",registerUser)

//login an user
router.post('/login',loginUser);

module.exports=router;