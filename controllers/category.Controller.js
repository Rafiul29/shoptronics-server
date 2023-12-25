// external import
const asyncHandler = require("express-async-handler");

// internal import
const Category = require("../models/category.model");
const { default: mongoose } = require("mongoose");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      throw new Error("Filed must be fill");
    }
    // category exists
    const categoryFound = await Category.findOne({ title });

    if (categoryFound) {
      throw new Error("Category already exists1");
    }

    // create category
    const category = await Category.create({
      title,
      user: req.userAuthId,
    });

    res.json({
      status: "success",
      message: "Category created successfully",
      category,
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

const getAllCategory = asyncHandler(async (req, res) => {
  try {

    const categories = await Category.find({}).populate("products");

    res.json({
      status: "success",
      message: "Category fetched successfully",
      categories,
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

const getSingleCategory = asyncHandler(async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).json({ message: "category id not found" });
      return;
    }

    const category = await Category.findById({ _id: cid }).populate('products');

    res.json({
      status: "success",
      message: "Category fetch successfully",
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
const updateSingleCategory = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    const cid = req.params.cid;

    if(!title){
      throw new Error("Field must be fill");
    }
    //check mogoose id
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).json({ message: "category id not found" });
      return;
    }
    // update
    const category = await Category.findByIdAndUpdate(
      { _id: cid },
      { title },
      { new: true }
    );

    res.json({
      status: "success",
      message: "category updated successfully",
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
const deleteSingleCategory = asyncHandler(async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).json({ message: "category id not found" });
      return;
    }

    const category = await Category.findByIdAndDelete({ _id: cid });
    res.json({
      status: "success",
      message: "category deleted successfully",
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
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
  deleteSingleCategory,
};
