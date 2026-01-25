import mongoose from "mongoose";

const mrfAgencySaleSchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      required: true,
      trim: true,
    },
    material: {
      type: String,
      required: true,
      trim: true,
    },
    weightKg: {
      type: Number,
      required: true,
    },
    ratePerKg: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    dateSubmitted: {
      type: String,
      default: new Date().toISOString(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("MrfAgencySale", mrfAgencySaleSchema);
