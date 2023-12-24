// external import
const express=require('express');

// internal import
const isloggedIn=require("../middlewares/isLoggedIn");
const { createReview } = require('../controllers/reviews.Controller');


//router
const router=express.Router();

// create review
router.post("/:productId",isloggedIn, createReview)

module.exports=router;

