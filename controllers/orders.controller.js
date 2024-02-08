const Order=require("../models/orders.model")

const getAllOrders = async (req, res) => {
  try {
    await Promise.resolve().then(async () => {
    const orders=await Order.find({}).populate('product user')
    res.status(200).json(orders);
    });
  } catch (error) {
    res.status(400).json({
      message: "Order not Found",
      error: error.message,
    });
  }
};

const getOrderUser = async (req, res) => {
  try {
    await Promise.resolve().then(async () => {
    const orders=await Order.find({user:req.userAuthId}).populate('product user')
    res.status(200).json(orders);
    });
  } catch (error) {
    res.status(400).json({
      message: "Order not Found",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderUser,
};