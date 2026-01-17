import express from 'express';
import { adminLogin, adminLogout } from '../controller/admin/admin.controller.js';
const router=express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);

export default router;