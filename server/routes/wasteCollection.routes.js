import express from "express";
import { createWasteCollection, deleteWasteCollection, getAllWasteCollections, updateWasteCollection } from "../controller/admin/wasteCollection.controller.js";




const router = express.Router();

router.post("/createwastecollection", createWasteCollection);
router.get("/getwastecollection", getAllWasteCollections);
router.put("/updatewastecollection/:id", updateWasteCollection);
router.delete("/deletewastecollection/:id", deleteWasteCollection);


export default router;
