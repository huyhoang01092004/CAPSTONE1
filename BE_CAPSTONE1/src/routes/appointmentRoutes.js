import express from "express";
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", getAppointments);
router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
