import mongoose from "mongoose";
import config from "./config.js";

const connectMongoose = async () => {
  const uri = config.mongoURI;
  if (!uri) {
    console.error("MONGOURI_ATLAS not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectMongoose;
