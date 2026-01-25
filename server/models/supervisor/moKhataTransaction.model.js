import mongoose from "mongoose";

const moKhataTransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["MAKE", "SELL"], required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true }, // store readable string
  },
  { timestamps: true }
);

const MoKhataTransaction = mongoose.model(
  "MoKhataTransaction",
  moKhataTransactionSchema
);

export default MoKhataTransaction;
