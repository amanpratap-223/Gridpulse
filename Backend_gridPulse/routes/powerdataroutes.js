import express from "express";
import {
  submitPowerData,
  getAllPowerData,
  getAllPowerDataFormatted, // ✅ new
} from "../controllers/powerdatacontroller.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// ✅ Existing Routes
router.post("/submit", protect, submitPowerData);
router.get("/charts", getAllPowerData); // unchanged

// ✅ NEW Route for InfoTable
router.get("/all", getAllPowerDataFormatted);

export default router;
