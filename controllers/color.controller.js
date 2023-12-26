// external import
const asyncHandler = require("express-async-handler");

// internal import
const Color =require('../models/color.model')
const { default: mongoose } = require("mongoose");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin
const createColor = asyncHandler(async (req, res) => {
  try {

    const { name } = req.body;

    if (!name) {
      throw new Error("Filed must be fill");
    }

    // brand exists
    const colorFound = await Color.findOne({ name });

    if (colorFound) {
      throw new Error("Color already exists1");
    }

    // create brand
    const color = await Color.create({
      name,
      user: req.userAuthId,
    });

    res.json({
      status: "success",
      message: "Color created successfully",
      color,
    });

  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

// @desc get all categories
//@route GET /api/categories
//@ access Public

const getAllColors = asyncHandler(async (req, res) => {
  try {

    const colors = await Color.find({}).populate("products");

    res.json({
      status: "success",
      message: "colors fetched successfully",
      colors,
    });

  } catch (error) {
    res.json({
      status: "faild",
      message: error.message,
    });
  }
});

// @desc get single categories
//@route GET /api/categories/:id
//@ access Public

const getSingleColor = asyncHandler(async (req, res) => {
  try {
    
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).json({ message: "color id not found" });
      return;
    }

    const brand = await Color.findById({ _id: bid }).populate('products');

    res.json({
      status: "success",
      message: "color fetch successfully",
      brand,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

//@desc update single product
// @route PUT /api/products/:id
//access privet/Admin
const updateSingleColor = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const cid = req.params.cid;

    if(!name){
      throw new Error("Field must be fill");
    }
    //check mogoose id
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).json({ message: "color id not found" });
      return;
    }
    // update
    const color = await Color.findByIdAndUpdate(
      { _id: cid },
      { name },
      { new: true }
    );

    res.json({
      status: "success",
      message: "color updated successfully",
      color,
    });
  }catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

//@desc delete single product
// @route DELETE /api/products/:id
//access privet/Admin
const deleteSingleColor = asyncHandler(async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).json({ message: "color id not found" });
      return;
    }

    const colorExistingProduct=await Color.findById({ _id: cid });

    if(colorExistingProduct?.products.length!==0){
      throw new Error("Existing color product must be delete");
    }

    const color = await Color.findByIdAndDelete({ _id: bid });

    res.json({
      status: "success",
      message: "color deleted successfully",
      color,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = {
  createColor,
  getAllColors,
  getSingleColor,
  updateSingleColor,
  deleteSingleColor,
};
