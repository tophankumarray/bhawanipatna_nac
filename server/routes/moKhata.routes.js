import express from "express";
import {
  getMoKhataDashboard,
  addKhata,
  sellKhata,
} from "../controller/supervisor/moKhata.controller.js";

const router = express.Router();

// dashboard data
router.get("/dashboard", getMoKhataDashboard);

// actions
router.post("/add", addKhata);
router.post("/sell", sellKhata);

export default router;
