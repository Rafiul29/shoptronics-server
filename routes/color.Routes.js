// external import
const express=require('express');

// internal import
const isloggedIn=require("../middlewares/isLoggedIn")
const{createColor,getSingleColor,updateSingleColor,deleteSingleColor,getAllColors} =require("../controllers/color.controller");

//router
const router=express.Router();

// create a new color
router.post("/",isloggedIn,createColor);

// get all colors
router.get("/",getAllColors);

//get a single color
router.get("/:cid",getSingleColor);

//update a single color
router.put("/:cid",isloggedIn,updateSingleColor)

// delete a single color
router.delete("/:cid",isloggedIn,deleteSingleColor)

module.exports=router;

