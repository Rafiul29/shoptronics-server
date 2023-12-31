// external import
const express=require('express');

// internal import
const {getAllUsers,updateUser,getSingleUser,deleteUser}=require("../controllers/users.Controller")

const isloggedIn=require("../middlewares/isLoggedIn");
const isAdmin = require('../middlewares/isAdmin');

//router
const router=express.Router();

// get single user
router.get("/profile",isloggedIn,getSingleUser)

// update user
router.put("/update-profile",isloggedIn,updateUser);

//delete user 
router.delete("/delete-profile",isloggedIn,deleteUser)

// get All users
router.get("/",isloggedIn,isAdmin,getAllUsers)

module.exports=router;