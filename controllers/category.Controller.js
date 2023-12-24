// external import
const asyncHandler = require("express-async-handler");

// internal import
const Category = require("../models/category.model");

// @desc create new category
//@route POST /api/categories
//@ access Privet/Admin

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  // category exists
  const categoryFound = await Category.findOne({ title });
  console.log(categoryFound)
  
  if (categoryFound) {
    throw new Error("Category already exists1");
  }

  // create
  const category = await Category.create({
    title,
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});


// @desc get all categories
//@route GET /api/categories
//@ access Public

const getAllCategory = asyncHandler(async (req, res) => {

  const categories=await Category.find({});
  

  res.json({
    status: "success",
    message: "Category fetched successfully",
    categories,
  });
});

// @desc get single categories
//@route GET /api/categories/:id
//@ access Public

const getSingleCategory = asyncHandler(async (req, res) => {

  const id=req.params.id;
  const category=await Category.findById({_id:id});
  

  res.json({
    status: "success",
    message: "Category fetch successfully",
    category,
  });
});

//@desc update single product
// @route PUT /api/products/:id
//access privet/Admin
const updateSingleCategory = asyncHandler(async (req, res) => {
  const {
    name,
  } = req.body;
  console.log(name)
  const id = req.params.id;
  // update
  
  const category=await Category.findByIdAndUpdate({_id:id},{name},{new:true})

  res.json({
    status: "success",
    message: "category updated successfully",
    category,
  });
});

//@desc delete single product
// @route DELETE /api/products/:id
//access privet/Admin
const deleteSingleCategory=asyncHandler(async(req,res)=>{
  const id = req.params.id;
  console.log(id)
    const category=await Category.findByIdAndDelete({_id:id});

    res.json({
      status: "success",
      message: "category deleted successfully",
      category,
    });
})


module.exports={
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
  deleteSingleCategory
}