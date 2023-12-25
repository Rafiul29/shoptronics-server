// external import
const asyncHandler = require("express-async-handler");

// internal import
const Product = require("../models/product.model");
const Category = require("../models/category.model");

// create a new product
// @route POST /api/products/
//access privet/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
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
      !title ||
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
    const productExists = await Product.findOne({ title });

    if (productExists) {
      throw new Error("Product Already Exists");
    }

    // push the product into category
    // find the category
    const categoryFound = await Category.findOne({
      title: category,
    });

    if (!categoryFound) {
      throw new Error(
        "Category not found, please create category first ir check category name"
      );
    }

    const product = await Product.create({
      title,
      description,
      category,
      colors,
      image_link,
      user: req.userAuthId,
      price,
      totalQty,
      brand,
    });

    // push the product the category
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();
    // create the product

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
    const products = await productQuery;

    res.json({
      status: "success",
      message: "Products fetch successfully",
      products,
    });
  } catch (error) {
    res.json({
      status: "faiked",
      message: error.message,
    });
  }
});

//@desc get single product
// @route GET /api/products/:id
//access public
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      res.status(404).json({ message: "product id not found" });
      return;
    }

    const product = await Product.findById({ _id: pid });
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
  try{
    const {
      title,
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
        title,
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
  }catch(error){
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
  try{
    const pid = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      res.status(404).json({ message: "product id not found" });
      return;
    }
    const product = await Product.findByIdAndDelete({ _id: id });
  
    res.json({
      status: "success",
      message: "Product deleted successfully",
      product,
    });
  }catch(error){
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
