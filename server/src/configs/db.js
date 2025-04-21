const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch {
    console.error("Error connecting to MongoDB");
  }
};

module.exports = connectDb;
