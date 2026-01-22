import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
  {
    wardName: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: Number,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    household: {
      type: Number,
      required: true,
    },
    wasteGenerationPerDay: {
      type: Number,
      required: true,
    },
    collectionFrequency: {
      type: String,
      enum: ["Daily", "Alternate Day", "Weekly"],
      required: true,
    },
    supervisorName: {
      type: String,
      required: true,
    },
    supervisorPhone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Ward", wardSchema);
