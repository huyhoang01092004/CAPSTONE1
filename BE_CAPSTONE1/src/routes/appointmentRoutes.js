import express from "express";
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByUser,
} from "../controllers/appointmentController.js";

const router = express.Router();

// 📌 Route đặc biệt phải đặt trước route động
router.get("/by-user/:userId", getAppointmentsByUser);

router.get("/", getAppointments);
router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);

// 📌 Hủy lịch hẹn (soft delete)
router.patch("/:id/cancel", cancelAppointment);

export default router;
