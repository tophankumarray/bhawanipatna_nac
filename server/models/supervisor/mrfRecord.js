import mongoose from "mongoose";

const mrfRecordSchema = new mongoose.Schema(
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
      enum: [1, 2, 3, 4, 5, 6],
      required: true,
    },
    image: {
      type: String, // image path
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MrfRecord", mrfRecordSchema);
