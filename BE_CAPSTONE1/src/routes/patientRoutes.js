import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByUserId,
  createGuestPatient,
} from "../controllers/patientController.js";

const router = Router();

router.get("/", getPatients);
router.get("/:id", getPatientById);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
router.get("/by-user/:userId", getPatientByUserId); // theo user_id
router.post("/guest", createGuestPatient);
export default router;
