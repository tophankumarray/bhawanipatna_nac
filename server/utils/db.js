import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in .env");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
