const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    sku: String,
    quantity: Number,
    price: Number,
    discountPrice: Number,
    unit: String,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    courier: String,
    trackingId: String,
    expectedDate: Date,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    address: addressSchema,
    paymentMethod: { type: String, enum: ["card", "cod"], default: "card" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    status: {
      type: String,
      enum: ["Placed", "Processing", "Out for Delivery", "Delivered"],
      default: "Placed",
    },
    delivery: deliverySchema,
    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    total: Number,
    invoiceUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

