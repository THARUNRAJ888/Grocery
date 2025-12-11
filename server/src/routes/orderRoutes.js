const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { generateInvoice } = require("../services/invoice");

const router = express.Router();

const calcTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = subtotal > 80 ? 0 : 4.99;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));
  return { subtotal, tax, deliveryFee, total };
};

router.use(authMiddleware);

router.post("/", async (req, res) => {
  if (req.user.role === "guest")
    return res.status(403).json({ message: "Login required to checkout" });
  const { items = [], addressId, address, paymentMethod = "card" } = req.body;
  if (paymentMethod === "card" && !req.body.cardLast4) {
    return res.status(400).json({ message: "Mock card details missing" });
  }
  const products = await Product.find({
    _id: { $in: items.map((i) => i.productId) },
  });
  const orderItems = items.map((it) => {
    const prod = products.find((p) => p._id.toString() === it.productId);
    if (!prod) return null;
    return {
      product: prod._id,
      name: prod.name,
      sku: prod.sku,
      quantity: it.quantity,
      price: prod.price,
      discountPrice: prod.discountPrice,
      unit: prod.unit,
    };
  });
  if (orderItems.includes(null))
    return res.status(400).json({ message: "Invalid product in cart" });

  const totals = calcTotals(orderItems);

  // reduce stock
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  const resolvedAddress =
    address || (await User.findById(req.user.id).then((u) => u.addresses.id(addressId)));

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    address: resolvedAddress,
    paymentMethod,
    paymentStatus: "paid",
    status: "Placed",
    ...totals,
  });

  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.status(201).json(order);
});

router.get("/", async (req, res) => {
  const query = req.user.role === "admin" ? {} : { user: req.user.id };
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  const requester = req.user.id?.toString();
  if (req.user.role !== "admin" && order.user.toString() !== requester) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json(order);
});

router.patch("/:id/status", adminOnly, async (req, res) => {
  const payload = {};
  if (req.body.status) payload.status = req.body.status;
  if (req.body.delivery) {
    const { trackingId, courier, expectedDate } = req.body.delivery;
    payload.delivery = {};
    if (trackingId) payload.delivery.trackingId = trackingId;
    if (courier) payload.delivery.courier = courier;
    if (expectedDate) payload.delivery.expectedDate = new Date(expectedDate);
  }
  const order = await Order.findByIdAndUpdate(req.params.id, payload, { new: true });
  res.json(order);
});

router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    const requester = req.user.id?.toString();
    if (req.user.role !== "admin" && order.user.toString() !== requester) {
      return res.status(403).json({ message: "Forbidden" });
    }
    generateInvoice(order, res);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Invoice error", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

module.exports = router;

