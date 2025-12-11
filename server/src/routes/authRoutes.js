const express = require("express");
const User = require("../models/User");
const { signToken } = require("../lib/jwt");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const role =
      inviteCode && inviteCode === process.env.ADMIN_INVITE_CODE ? "admin" : "user";
    const user = await User.create({ name, email, password, role, inviteCodeUsed: inviteCode });
    const token = signToken({ id: user._id, role: user.role });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = signToken({ id: user._id, role: user.role });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.post("/guest", async (_req, res) => {
  // guest token is ephemeral; no DB entry needed
  const token = signToken({ id: "guest", role: "guest" }, "2d");
  res.json({ token, user: { role: "guest", name: "Guest" } });
});

router.get("/me", authMiddleware, async (req, res) => {
  if (req.user.role === "guest") {
    return res.json({ user: { role: "guest", name: "Guest" } });
  }
  const user = await User.findById(req.user.id);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    },
  });
});

router.post("/addresses", authMiddleware, async (req, res) => {
  if (req.user.role === "guest")
    return res.status(403).json({ message: "Guest cannot manage addresses" });
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save();
  res.json({ addresses: user.addresses });
});

router.put("/addresses/:id", authMiddleware, async (req, res) => {
  if (req.user.role === "guest")
    return res.status(403).json({ message: "Guest cannot manage addresses" });
  const user = await User.findById(req.user.id);
  const idx = user.addresses.findIndex((a) => a._id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Address not found" });
  user.addresses[idx] = { ...user.addresses[idx].toObject(), ...req.body };
  await user.save();
  res.json({ addresses: user.addresses });
});

router.delete("/addresses/:id", authMiddleware, async (req, res) => {
  if (req.user.role === "guest")
    return res.status(403).json({ message: "Guest cannot manage addresses" });
  const user = await User.findById(req.user.id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
  await user.save();
  res.json({ addresses: user.addresses });
});

module.exports = router;

