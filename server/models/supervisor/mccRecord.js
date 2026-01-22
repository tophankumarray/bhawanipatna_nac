import mongoose from "mongoose";

const mccRecordSchema = new mongoose.Schema(
  {
    wealthCenter: {
      type: String,
      default: "Buguda NAC",
    },
    supervisorName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    cubeNumber: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      required: true,
    },
    image: {
      type: String, // image path
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MccRecord", mccRecordSchema);
