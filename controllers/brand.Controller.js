// external import
const asyncHandler = require("express-async-handler");

// internal import
const Brand =require('../models/brand.model')
const { default: mongoose } = require("mongoose");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin
const createBrand = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      throw new Error("Filed must be fill");
    }
    // category exists
    const categoryFound = await Brand.findOne({ title });

    if (categoryFound) {
      throw new Error("Brand already exists1");
    }

    // create category
    const brand = await Brand.create({
      title,
      user: req.userAuthId,
    });

    res.json({
      status: "success",
      message: "Brand created successfully",
      brand,
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

const getAllBrands = asyncHandler(async (req, res) => {
  try {

    const brands = await Category.find({}).populate("products");

    res.json({
      status: "success",
      message: "Brand fetched successfully",
      brands,
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

const getSingleBrand = asyncHandler(async (req, res) => {
  try {
    const bid = req.params.bid;

    if (!mongoose.Types.ObjectId.isValid(bid)) {
      res.status(404).json({ message: "brand id not found" });
      return;
    }

    const category = await Brand.findById({ _id: cid }).populate('products');

    res.json({
      status: "success",
      message: "Brand fetch successfully",
      category,
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
const updateSingleBrand = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    const bid = req.params.bid;

    if(!title){
      throw new Error("Field must be fill");
    }
    //check mogoose id
    if (!mongoose.Types.ObjectId.isValid(bid)) {
      res.status(404).json({ message: "brand id not found" });
      return;
    }
    // update
    const category = await Brand.findByIdAndUpdate(
      { _id: bid },
      { title },
      { new: true }
    );

    res.json({
      status: "success",
      message: "brand updated successfully",
      category,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

//@desc delete single product
// @route DELETE /api/products/:id
//access privet/Admin
const deleteSingleBrand = asyncHandler(async (req, res) => {
  try {
    const bid = req.params.bid;

    if (!mongoose.Types.ObjectId.isValid(bid)) {
      res.status(404).json({ message: "brand id not found" });
      return;
    }

    const brand = await Brand.findByIdAndDelete({ _id: bid });
    res.json({
      status: "success",
      message: "brand deleted successfully",
      category,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateSingleBrand,
  deleteSingleBrand,
};
