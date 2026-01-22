import express from "express";
import { createMrfRecord, getAllMrfRecords } from "../controller/supervisor/mrf.controller.js";
import upload from "../utils/multer.js";



const router = express.Router();

router.post("/create-mrf-record", upload.single("image"), createMrfRecord);
router.get("/all-mrf-records", getAllMrfRecords);



export default router;
