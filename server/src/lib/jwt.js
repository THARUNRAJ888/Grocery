const jwt = require("jsonwebtoken");

const signToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn });

module.exports = { signToken };

