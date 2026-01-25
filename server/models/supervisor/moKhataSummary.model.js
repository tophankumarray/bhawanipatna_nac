import mongoose from "mongoose";

const moKhataSummarySchema = new mongoose.Schema(
  {
    khataStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MoKhataSummary = mongoose.model("MoKhataSummary", moKhataSummarySchema);
export default MoKhataSummary;
