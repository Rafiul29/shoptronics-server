// external import
const express=require('express');

// internal import
const {createProduct,getAllProducts,getSingleProduct,updateSingleProduct,deleteSingleProduct}=require("../controllers/products.Controller")
const isloggedIn=require("../middlewares/isLoggedIn")
const isAdmin=require("../middlewares/isAdmin")
//router
const router=express.Router();

// create a new product
router.post("/",isloggedIn,isAdmin,createProduct);

// get all products
router.get("/", getAllProducts);

// get single product
router.get("/:id",getSingleProduct)

// update single product
router.put("/:id",isloggedIn,isAdmin,updateSingleProduct);

//delete single product
router.delete("/:id",isloggedIn,isAdmin, deleteSingleProduct);

module.exports=router