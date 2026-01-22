import express from "express";

import upload from "../utils/multer.js";
import { createMccRecord, getAllMccRecords } from "../controller/supervisor/mcc.controller.js";



const router = express.Router();

router.post("/create-mcc-record", upload.single("image"), createMccRecord);
router.get("/all-mcc-records", getAllMccRecords);



export default router;
