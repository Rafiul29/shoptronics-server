// external import
const asyncHandler = require("express-async-handler");

// internal import
const Product = require("../models/product.model");
const Category = require("../models/category.model");

// create a new product
// @route POST /api/products/
//access privet/Admin
const createProduct = asyncHandler(async (req, res) => {
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

  // productExists
  const productExists = await Product.findOne({ title });

  if (productExists) {
    throw new Error("Product Already Exists");
  }

  const product = await Product.create({
    title,
    description,
    category,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
  });

  // push the product into category
  // find the category
  const categoryFound=await Category.findOne({
    title:category,
  })

  if(!categoryFound){
    throw new Error("Category not found, please create category first ir check category name")
  }

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
});


//get all products
// @route GET /api/products/
//access public
const getAllProducts = asyncHandler(async (req, res) => {
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
  const products = await productQuery

  res.json({
    status: "success",
    message: "Products fetch successfully",
    products,
  });
});

//@desc get single product
// @route GET /api/products/:id
//access public
const getSingleProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById({ _id: id })
  if (!product) {
    throw new Error("Product not found");
  }

  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

//@desc update single product
// @route PUT /api/products/:id
//access privet/Admin
const updateSingleProduct = asyncHandler(async (req, res) => {
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
  const id = req.params.id;
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
});


//@desc delete single product
// @route DELETE /api/products/:id
//access privet/Admin
const deleteSingleProduct=asyncHandler(async(req,res)=>{
  const id = req.params.id;
  console.log(id)
    const product=await Product.findByIdAndDelete({_id:id});

    res.json({
      status: "success",
      message: "Product deleted successfully",
      product,
    });
})

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct
};
