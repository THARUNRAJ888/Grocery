const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  if (req.user.role === "guest") return res.json({ items: [] });
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { items: [] });
});

router.post("/sync", async (req, res) => {
  if (req.user.role === "guest") return res.json({ items: [] });
  const { items = [] } = req.body;
  const products = await Product.find({ _id: { $in: items.map((i) => i.product) } });
  const validatedItems = items
    .map((item) => {
      const prod = products.find((p) => p._id.toString() === item.product);
      if (!prod) return null;
      return { product: prod._id, quantity: item.quantity };
    })
    .filter(Boolean);
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { user: req.user.id, items: validatedItems },
    { upsert: true, new: true }
  );
  res.json(cart);
});

router.post("/", async (req, res) => {
  if (req.user.role === "guest") return res.status(403).json({ message: "Login required" });
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    const created = await Cart.create({
      user: req.user.id,
      items: [{ product: product._id, quantity }],
    });
    return res.json(created);
  }
  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx >= 0) cart.items[idx].quantity += quantity;
  else cart.items.push({ product: product._id, quantity });
  await cart.save();
  res.json(cart);
});

router.put("/:productId", async (req, res) => {
  if (req.user.role === "guest") return res.status(403).json({ message: "Login required" });
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart empty" });
  const idx = cart.items.findIndex((i) => i.product.toString() === req.params.productId);
  if (idx === -1) return res.status(404).json({ message: "Item not found" });
  cart.items[idx].quantity = quantity;
  await cart.save();
  res.json(cart);
});

router.delete("/:productId", async (req, res) => {
  if (req.user.role === "guest") return res.status(403).json({ message: "Login required" });
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart empty" });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;

