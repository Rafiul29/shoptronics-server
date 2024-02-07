const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: "User",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Product",
    },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);