// external import
const asyncHandler = require("express-async-handler");

// internal import
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const { default: mongoose } = require("mongoose");
const Color = require("../models/color.model");

// create a new product
// @route POST /api/products/
//access private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      brandId,
      image_link,
      price,
      totalQty,
    } = req.body;
    if (
      !title ||
      !description ||
      !categoryId ||
      !brandId ||
      !image_link ||
      !price ||
      !totalQty
    ) {
      throw new Error("All Filed Must be fill");
    }
    // productExists
    const productExists = await Product.findOne({ title });

    if (productExists) {
      throw new Error("Product Already Exists");
    }

    // find the category
    const categoryFound = await Category.findOne({
      _id: categoryId,
    });

    if (!categoryFound) {
      throw new Error(
        "Category not found, please create category first ir check category name"
      );
    }

    //find the brand
    const brandFound = await Brand.findOne({
      _id: brandId,
    });

    if (!brandFound) {
      throw new Error(
        "Brand not found, please create brand first  check brand name"
      );
    }

    // create the product
    const product = await Product.create({
      title,
      description,
      categoryId,
      brandId,
      image_link,
      user: req.userAuthId,
      price,
      totalQty,
    });

    // push the product into category
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();

    // push the product into brand
    brandFound.products.push(product._id);
    // resave
    await brandFound.save();

    // send response
    res.json(product);
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
    if (req.query.title) {
      productQuery = productQuery.find({
        title: { $regex: req.query.title, $options: "i" },
      });
    }
  

     // filter by brand
     const brandId = req.query.brandId;
     if (brandId) {
      productQuery = productQuery.find({brandId});
     }

     // filter by category
     const categoryId = req.query.categoryId;
     
     if (categoryId) {
      productQuery = productQuery.find({categoryId});
     }

    // filter by price range
    // if (req.query.price) {
    //   const priceRange = req.query.price.split("-");
    //   //  gte:grether or equal
    //   //  lte: less or equal
    //   productQuery = productQuery.find({
    //     price: { $gte: priceRange[0], $lte: priceRange[1] },
    //   });
    // }

    // await the query
    const products = await productQuery.populate("categoryId brandId");
    console.log(products.length)
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({
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

    const product = await Product.findById({ _id: pid }).populate(
      "categoryId brandId"
    );

    if (!product) {
      throw new Error("Product not found");
    }

    res.json(product);
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
      title,
      description,
      categoryId,
      brandId,
      image_link,
      price,
      totalQty,
    } = req.body;
    if (
      !title ||
      !description ||
      !categoryId ||
      !brandId ||
      !image_link ||
      !price ||
      !totalQty
    ) {
      throw new Error("All Filed Must be fill");
    }
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      res.status(404).json({ message: "product id not found" });
      return;
    }

    // update
    const product = await Product.findByIdAndUpdate(
      { _id: pid },
      {
        title,
        description,
        categoryId,
        brandId,
        image_link,
        price,
        totalQty,
      },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    // response
    res.json(product);
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

    // response
    res.json(product);
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
