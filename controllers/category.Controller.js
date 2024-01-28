// external import
const asyncHandler = require("express-async-handler");

// internal import
const Category = require("../models/category.model");
const { default: mongoose } = require("mongoose");
const { response } = require("express");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("Filed must be fill");
    }
    // category exists
    const categoryFound = await Category.findOne({ name });

    if (categoryFound) {
      throw new Error("Category already exists1");
    }

    // create category
    const category = await Category.create({
      name,
      user: req.userAuthId,
    });
    // response
    res.json(category);
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
    // response
    res.json(categories);
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

    const category = await Category.findById({ _id: cid }).populate("products");
    // response
    res.json(category);
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
    const { name } = req.body;
    const cid = req.params.cid;

    if (!name) {
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
      { name },
      { new: true }
    );
    // response
    res.json(category);
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

    const categoryExistingProduct = await Category.findById({ _id: cid });
    if (categoryExistingProduct?.products?.length !== 0) {
      throw new Error("Existing Category product must be delete");
    }

    const category = await Category.findByIdAndDelete({ _id: cid });
    // response
    res.json(category);
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
