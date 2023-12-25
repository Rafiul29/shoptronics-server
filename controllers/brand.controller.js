// external import
const asyncHandler = require("express-async-handler");

// internal import
const Brand = require("../models/brand.model");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin
const createBrand = asyncHandler(async (req, res) => {

  const { title } = req.body;
  if(!title){
    throw new Error("Filed must be fill");
  }
  // category exists
  const brandFound = await Brand.findOne({ title });

  if (brandFound) {
    throw new Error("Brand already exists1");
  }

  // create
  const brand = await Brand.create({
    title,
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Category created successfully",
    brand,
  });
});

// @desc get all categories
//@route GET /api/categories
//@ access Public

const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).populate("Product");

  res.json({
    status: "success",
    message: "brand fetched successfully",
    brands,
  });
});

// @desc get single categories
//@route GET /api/categories/:id
//@ access Public

const getSingleBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const brand = await Brand.findById({ _id: id });

  res.json({
    status: "success",
    message: "Brand fetch successfully",
    brand,
  });
});

//@desc update single product
// @route PUT /api/products/:id
//access privet/Admin
const updateSingleBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const id = req.params.id;
  // update
  const brand = await Brand.findByIdAndUpdate(
    { _id: id },
    { title },
    { new: true }
  );

  res.json({
    status: "success",
    message: "category updated successfully",
    brand,
  });
});

//@desc delete single product
// @route DELETE /api/products/:id
//access privet/Admin
const deleteSingleBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const brand = await Brand.findByIdAndDelete({ _id: id });

  res.json({
    status: "success",
    message: "category deleted successfully",
    brand,
  });
});

module.exports = {
 createBrand,
 getAllBrands,
 getSingleBrand,
 updateSingleBrand,
 deleteSingleBrand
};
