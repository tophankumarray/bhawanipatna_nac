import express from "express";
import { createMachineryDefect, getAllMachineryDefects, updateMachineryDefect } from "../controller/supervisor/machineryDefect.controller.js";
import upload from "../utils/multer.js";



const router = express.Router();

router.post("/create-machinery-defect", upload.single("image"), createMachineryDefect);
router.get("/all-machinery-defects", getAllMachineryDefects);
router.put("/update-machinery-defect/:id", upload.single("image"), updateMachineryDefect);



export default router;
