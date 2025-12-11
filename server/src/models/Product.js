const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    desc: String,
    images: [String],
    stock: { type: Number, default: 0 },
    unit: String,
    rating: { type: Number, default: 0 },
    tags: [String],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

