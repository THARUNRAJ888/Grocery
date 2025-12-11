const mongoose = require("mongoose");

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI missing");
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  return mongoose.connection;
};

module.exports = connectDb;

