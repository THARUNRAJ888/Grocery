const express = require("express");
const Product = require("../models/Product");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const { page = 1, limit = 20, category, search, sort, inStock, ratingMin, priceMin, priceMax } =
    req.query;
  const query = {};
  if (category) query.category = category;
  if (inStock) query.stock = { $gt: 0 };
  if (ratingMin) query.rating = { $gte: Number(ratingMin) };
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }
  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { desc: new RegExp(search, "i") },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const products = await Product.find(query)
    .sort(sortMap[sort] || { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Product.countDocuments(query);
  res.json({ data: products, total });
});

router.get("/:id", async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err.message });
  }
});

router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  const updated = await Product.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
  });
  res.json(updated);
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  await Product.findOneAndDelete({ id: req.params.id });
  res.json({ message: "Deleted" });
});

module.exports = router;

