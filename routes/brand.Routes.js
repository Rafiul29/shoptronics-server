// external import
const express=require('express');

// internal import
const isloggedIn=require("../middlewares/isLoggedIn")
const{createBrand,getAllBrands,updateSingleBrand,deleteSingleBrand, getSingleBrand} =require("../controllers/brand.Controller");

//router
const router=express.Router();

// create a new Brand
router.post("/",isloggedIn,createBrand);

// get all brands
router.get("/",getAllBrands);

//get a single brand
router.get("/:cid",getSingleBrand);

//update a single brand
router.put("/:cid",isloggedIn,updateSingleBrand)

// delete a single brand
router.delete("/:cid",isloggedIn,deleteSingleBrand)

module.exports=router;

