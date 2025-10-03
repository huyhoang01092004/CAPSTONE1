import { Router } from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientByUserId,
  createGuestPatient,
  createPatientForUser,
} from "../controllers/patientController.js";

const router = Router();

// ⚡ Ưu tiên route cụ thể trước
router.get("/by-user/:userId", getPatientByUserId); // lấy theo user_id
router.post("/guest", createGuestPatient); // tạo patient guest
router.post("/create", createPatientForUser); // tạo patient cho user đã có account

// Các route chung
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
