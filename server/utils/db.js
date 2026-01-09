import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
