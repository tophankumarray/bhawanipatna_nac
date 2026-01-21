import mongoose from "mongoose";

const wasteCollectionSchema = new mongoose.Schema(
  {
    ward: {
      type: String,
      enum: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    route: {
      type: String, // free text like "Route 5"
      required: true,
      trim: true,
    },
    wasteType: {
      type: String,
      enum: ["Mixed Waste", "Organic Waste", "Recyclable", "Hazardous"],
      required: true,
    },
    targetQuantity: {
      type: Number, // tons
      required: true,
    },
    collectionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inprogress", "completed", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("WasteCollection", wasteCollectionSchema);
