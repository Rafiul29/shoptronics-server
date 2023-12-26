// external import
const asyncHandler = require("express-async-handler");

// internal import
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand =require("../models/brand.model")
const { default: mongoose } = require("mongoose");

// create a new product
// @route POST /api/products/
//access private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      colors,
      image_link,
      user,
      price,
      totalQty,
      brand,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !colors ||
      !price ||
      !totalQty ||
      !brand ||
      !image_link
    ) {
      throw new Error("All Filed Must be fill");
    }
    // productExists
    const productExists = await Product.findOne({ name });

    if (productExists) {
      throw new Error("Product Already Exists");
    }

    // find the category
    const categoryFound = await Category.findOne({
      _id: category,
    });

    if (!categoryFound) {
      throw new Error(
        "Category not found, please create category first ir check category name"
      );
    }

    //find the brand
    const brandFound = await Brand.findOne({
      _id: brand,
    });

    if (!brandFound) {
      throw new Error(
        "Brand not found, please create category first  check brand name"
      );
    }

  // create the product
    const product = await Product.create({
      name,
      description,
      category,
      brand:brandFound._id,
      colors,
      image_link,
      user: req.userAuthId,
      price,
      totalQty,
    });

    // push the product the category
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();

    // push the product the category
    brandFound.products.push(product._id);
    // resave
    await brandFound.save();

    // send response
    res.json({
      status: "success",
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

//get all products
// @route GET /api/products/
//access public
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // query
    let productQuery = Product.find();

    // search by name
    if (req.query.name) {
      productQuery = productQuery.find({
        name: { $regex: req.query.name, $options: "i" },
      });
    }

    // filter by brand
    if (req.query.brand) {
      productQuery = productQuery.find({
        brand: { $regex: req.query.brand, $options: "i" },
      });
    }

    // filter by category
    if (req.query.category) {
      productQuery = productQuery.find({
        category: { $regex: req.query.category, $options: "i" },
      });
    }

    // filter by price range
    if (req.query.price) {
      const priceRange = req.query.price.split("-");
      //  gte:grether or equal
      //  lte: less or equal
      productQuery = productQuery.find({
        price: { $gte: priceRange[0], $lte: priceRange[1] },
      });
    }

    // await the query
    const products = await productQuery.populate("category brand");

    res.json({
      status: "success",
      message: "Products fetch successfully",
      products,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

//@desc get single product
// @route GET /api/products/:pid
//access public
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      res.status(404).json({ message: "product id not found" });
      return;
    }

    const product = await Product.findById({ _id: pid }).populate("category");
    if (!product) {
      throw new Error("Product not found");
    }

    res.json({
      status: "success",
      message: "Product fetched successfully",
      product,
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
const updateSingleProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    } = req.body;
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      res.status(404).json({ message: "product id not found" });
      return;
    }

    // update
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand,
      },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    res.json({
      status: "success",
      message: "Product updated successfully",
      product,
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
const deleteSingleProduct = asyncHandler(async (req, res) => {
  try {
    const pid = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      res.status(404).json({ message: "product id not found" });
      return;
    }

    const product = await Product.findByIdAndDelete({ _id: pid });

    // delete category model product id
    await Category.findOneAndUpdate(product.category, {
      $pull: {
        products: product._id,
      },
    });

    // delete brand  Model product id 
    await Brand.findOneAndUpdate(product.brand, {
      $pull: {
        products: product._id,
      },
    });

    res.json({
      product,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
};
