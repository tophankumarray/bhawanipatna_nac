import express from "express";
import { createFuelEntry, deleteFuelEntry, getAllFuelEntries, updateFuelEntry } from "../controller/admin/fuelManagement.controller.js";




const router = express.Router();


router.post("/fuel-management", createFuelEntry);
router.get("get-all-fuel-management", getAllFuelEntries);
router.put("/fuel-management/:id", updateFuelEntry);
router.delete("/fuel-management/:id", deleteFuelEntry);





export default router;