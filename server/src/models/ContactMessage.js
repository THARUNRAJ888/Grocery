const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);

