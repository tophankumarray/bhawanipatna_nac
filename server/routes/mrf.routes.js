import express from "express";
import { createMrfRecord, getAllMrfRecords } from "../controller/supervisor/mrf.controller.js";
import upload from "../utils/multer.js";
import { createAgencySale,getAllAgencySales } from "../controller/supervisor/mrfAgencySale.controller.js";
import { resetWealthCenter } from "../controller/supervisor/mrfAgencySale.controller.js";


const router = express.Router();

router.post("/create-mrf-record", upload.single("image"), createMrfRecord);
router.get("/all-mrf-records", getAllMrfRecords);

router.post("/create-agency-sale", createAgencySale);
router.get("/all-agency-sales", getAllAgencySales);
router.delete("/reset-wealth-center", resetWealthCenter);

export default router;
