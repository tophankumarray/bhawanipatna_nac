import mongoose from "mongoose";

const moKhataDailySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // "YYYY-MM-DD"
    todayMade: { type: Number, default: 0 },
    todaySold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MoKhataDaily = mongoose.model("MoKhataDaily", moKhataDailySchema);
export default MoKhataDaily;
