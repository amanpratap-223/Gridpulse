import express from "express";
import { createSubstation, getAllSubstations } from "../controllers/substationcontroller.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

// For now: anyone logged in can create; later we'll restrict to managers only
router.post("/",  createSubstation);//protect middleware add kr lena later on to protect it from unauthorised or not logged in peoplew
router.get("/",  getAllSubstations);
//pehle endpoint banta fir isko check krte api se content bhej ke, fir bad mein jab woh test successful hojaye to frontend bana do wahi same cheezx krne ko
export default router;
