const mongoose=require("mongoose");

// product schema
const productSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true
  },
  brand:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    ref:"Category",
    required:true,
  },
  colors:{
    type:[String],
    required:true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },
  image_link:
    {
      type:String,
      required:true,
    },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  price:{
    type:Number,
    required:true,
  },
  totalQty:{
    type:Number,
    required:true,
  },
},{
  timestamps:true,
});


const Product=mongoose.model("Product",productSchema);
module.exports=Product;