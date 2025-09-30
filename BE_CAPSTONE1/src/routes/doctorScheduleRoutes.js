import express from "express";
import { getAvailableSlots } from "../controllers/doctorScheduleController.js";

const router = express.Router();

router.get("/:doctorId/slots", getAvailableSlots);
export default router;
