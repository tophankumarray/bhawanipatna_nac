import mongoose from "mongoose";

const fuelManagementSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "CNG"],
      required: true,
    },
    quantityLiters: {
      type: Number,
      required: true,
    },
    pricePerLiter: {
      type: Number,
      required: true,
    },
    odometerReading: {
      type: Number, // km
      required: true,
    },
    efficiency: {
      type: Number, // km per liter
      required: true,
    },
    fillingStation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("FuelManagement", fuelManagementSchema);
