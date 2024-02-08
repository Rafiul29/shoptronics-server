const express = require("express");
const router = express.Router();

const isloggedIn=require("../middlewares/isLoggedIn");
const isAdmin = require('../middlewares/isAdmin');

const {getOrderUser,getAllOrders}=require("../controllers/orders.controller");

router.get("/",isloggedIn,isAdmin,getAllOrders);
// get AllOrders 

// get order existing user
router.get("/user",isloggedIn,getOrderUser);




module.exports = router;