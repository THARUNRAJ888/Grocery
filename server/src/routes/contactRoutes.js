const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const saved = await ContactMessage.create(req.body);
  res.status(201).json(saved);
});

router.get("/", authMiddleware, adminOnly, async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = router;

