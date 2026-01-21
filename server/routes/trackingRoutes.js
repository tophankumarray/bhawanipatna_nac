import express from "express";
// import isAuthenticated from './../middleware/authMiddleware';
import { getTrackings } from "../controller/admin/vehicle.controller.js";


const router = express.Router();

router.get("/trackings", getTrackings )

export default router;


