import express from 'express';
import { submitPowerData } from '../controllers/powerdatacontroller.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect

const router = express.Router();

router.post('/submit', protect, submitPowerData);

export default router;
