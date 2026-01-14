import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    wardNumber: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    category: {
      type: [String],
      required: true,
      enum: [
        "Illegal Dumping of C & D Waste",
        "Dead Animals",
        "Practice of Manual Scavenging",
        "Open Defecation",
        "Urination in Public",
        "No Electricity in Public Toilet",
        "Stagnant Water on the Road",
        "Sewerage or Storm Water Overflow",
        "Open Manholes or Drains",
        "Improper Disposal of Faecal Waste or Septage",
        "Cleaning of Sewer",
        "Public Toilet Blockage",
        "Public Toilet Cleaning",
        "Cleaning of Drain",
        "No Water Supply in Public Toilet",
        "Garbage Dump",
        "Dustbins Not Cleaned",
        "Sweeping Not Done",
        "Burning Of Garbage In Open Space",
        "Garbage Vehicle Not Arrived",
        "Cleaning of Garbage from Public Spaces",
        "Cleaning of Street Roads",
        "Door To Door Collection Not Done",
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // store image URL or file path
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "In Progress", "Resolved"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
