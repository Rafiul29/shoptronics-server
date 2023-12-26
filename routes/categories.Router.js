// external import
const express=require('express');

// internal import
const isloggedIn=require("../middlewares/isLoggedIn")
const {createCategory,getAllCategory,getSingleCategory,updateSingleCategory,deleteSingleCategory}=require("../controllers/category.Controller")

//router
const router=express.Router();

// create a new category
router.post("/",isloggedIn,createCategory);

// get all categories
router.get("/",getAllCategory);

// get a single category
router.get("/:cid",getSingleCategory);

// update a single  category
router.put("/:cid",isloggedIn,updateSingleCategory)

// delete a single category
router.delete("/:cid",isloggedIn,deleteSingleCategory)

module.exports=router;

