// external import
const express=require('express');

// internal import
const isloggedIn=require("../middlewares/isLoggedIn")
const {createCategory,getAllCategory,getSingleCategory,updateSingleCategory,deleteSingleCategory}=require("../controllers/category.Controller")

//router
const router=express.Router();


router.post("/",isloggedIn,createCategory);

router.get("/",getAllCategory);

router.get("/:cid",getSingleCategory);

router.put("/:cid",isloggedIn,updateSingleCategory)

router.delete("/:cid",isloggedIn,deleteSingleCategory)

module.exports=router;

