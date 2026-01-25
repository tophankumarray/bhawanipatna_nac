import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import complaintRoutes from "./routes/complaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import trackRoutes from "./routes/trackingRoutes.js";
import wardRoutes from "./routes/ward.routes.js";
import supervisorRoutes from "./routes/supervisor.routes.js";
import wasteCollectionRoutes from "./routes/wasteCollection.routes.js";
import fuelManagementRoutes from "./routes/fuelManagement.routes.js";
import machineryDefectRoutes from "./routes/machineryDefect.routes.js";
import mccRoutes from "./routes/mcc.routes.js";
import mrfRoutes from "./routes/mrf.routes.js";
import moKhataRoutes from "./routes/moKhata.routes.js";


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
app.use("/api/tracking", trackRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/waste-collections", wasteCollectionRoutes);
app.use("/api/fuel-management", fuelManagementRoutes);
app.use("/api/machinery-defects", machineryDefectRoutes);
app.use("/api/mcc", mccRoutes);
app.use("/api/mrf", mrfRoutes);
app.use("/api/mokhata", moKhataRoutes);





const PORT = process.env.PORT || 5900;


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});
