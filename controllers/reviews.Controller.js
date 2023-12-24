const asyncHandler = require("express-async-handler");
const Review = require("../models/review.model");
const Product = require("../models/product.model");

// create a new product
// @route POST /api/reviews/
// access privet/Admin

const createReview = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;

  // 1.find the product
  const { productId } = req.params;
  const productFound = await Product.findById(productId);

  if (!productFound) {
    throw new Error("Product Not found");
  }
  // check if user already reiviewed this product

    const hasReviewed=productFound?.reviews?.find((review)=>{
      console.log(String(review?.user))
      // return review?.user==req?.userAuthId
    })
  

  // create review
  const review = await Review.create({
    message,
    rating,
    product: productFound._id,
    user: req.userAuthId,
  });
console.log(review)
  productFound.reviews.push({review});
  await productFound.save();

  res.status(201).json({
    success:true,
    message:"Review create successfully",
  })
  
});

module.exports = {
  createReview,
};
