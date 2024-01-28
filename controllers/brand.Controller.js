// external import
const asyncHandler = require("express-async-handler");

// internal import
const Brand = require("../models/brand.model");
const { default: mongoose } = require("mongoose");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin
const createBrand = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("Filed must be fill");
    }

    // brand exists
    const brandFound = await Brand.findOne({ name });

    if (brandFound) {
      throw new Error("Brand already exists1");
    }

    // create brand
    const brand = await Brand.create({
      name,
      user: req.userAuthId,
    });
    // response
    res.json(brand);
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
    const brands = await Brand.find({}).populate("products");
    // response
    res.json(brands);
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

    const brand = await Brand.findById({ _id: bid }).populate("products");
    // response
    res.json(brand);
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
    const { name } = req.body;
    const bid = req.params.bid;

    if (!name) {
      throw new Error("Field must be fill");
    }
    //check mogoose id
    if (!mongoose.Types.ObjectId.isValid(bid)) {
      res.status(404).json({ message: "brand id not found" });
      return;
    }
    // update
    const brand = await Brand.findByIdAndUpdate(
      { _id: bid },
      { name },
      { new: true }
    );
    // response
    res.json(brand);
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
    const brandExistingProduct = await Brand.findById({ _id: bid });
    if (brandExistingProduct?.products.length !== 0) {
      throw new Error("Existing brand product must be delete");
    }
    const brand = await Brand.findByIdAndDelete({ _id: bid });
    // response
    res.json(brand);
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
