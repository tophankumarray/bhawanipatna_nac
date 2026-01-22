import express from "express";
import { createComplaint, getAllComplaints, updateComplaintStatus } from "../controller/citizen/complaint.controller.js";
import upload from "../utils/multer.js";



const router = express.Router();

router.post("/createcomplaint", upload.single("image"), createComplaint);
router.get("/allcomplaints", getAllComplaints);

router.put("/update-complaint-status/:id", updateComplaintStatus);


export default router;