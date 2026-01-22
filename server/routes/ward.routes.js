import express from "express";
import { createWard, getAllWards } from "../controller/admin/ward.controller.js";



const router = express.Router();


router.post("/createward", createWard);
router.get("/getallwards", getAllWards);


export default router;
