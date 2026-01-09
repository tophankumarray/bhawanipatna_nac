import express from "express";
import { createComplaint, getAllComplaints } from "../controller/citizen/complaint.controller.js";
import upload from "../utils/multer.js";



const router = express.Router();

router.post("/", upload.single("image"), createComplaint);
router.get("/", getAllComplaints);;




export default router;