import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const supervisorSchema = new mongoose.Schema(
  {
    supervisorName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
   
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

/* ✅ FIXED password hash middleware */
supervisorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* Compare password */
supervisorSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Supervisor", supervisorSchema);
