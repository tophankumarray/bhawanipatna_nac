import express from "express";
import { createSupervisor, getAllSupervisors, supervisorLogin } from "../controller/admin/supervisor.controller.js";



const router = express.Router();

router.post("/createsupervisor",createSupervisor);
router.get("/getallsupervisors", getAllSupervisors);

router.post("/loginsupervisor", supervisorLogin);



export default router;
