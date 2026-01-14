import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import complaintRoutes from "./routes/complaint.routes.js";



const app = express();

// Database
connectDB();


dotenv.config({ path: ".env" });



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



const PORT = process.env.PORT || 5900;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});
