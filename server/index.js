import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import complaintRoutes from "./routes/complaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config({ path: ".env" });

const app = express();

// Database
connectDB();






// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend running successfully",
    success: true,
  });
});

// Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);



const PORT = process.env.PORT || 5900;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});
