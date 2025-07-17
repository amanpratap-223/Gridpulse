import express from 'express';
import { signup, login } from '../controllers/attendantcontroller.js';
import { getAllAttendants } from "../controllers/attendantcontroller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/",protect, getAllAttendants);


export default router; // ✅ required for import
