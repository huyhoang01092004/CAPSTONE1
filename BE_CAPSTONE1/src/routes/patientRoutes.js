import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByUserId,
} from "../controllers/patientController.js";

const router = Router();

router.get("/", getPatients);
router.get("/:id", getPatientById);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
router.get("/by-user/:userId", getPatientByUserId); // theo user_id

export default router;
