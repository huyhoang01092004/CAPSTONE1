import * as PatientModel from "../models/Patient.js";

export const getPatients = async (req, res) => {
  try {
    const patients = await PatientModel.findAll();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const id = await PatientModel.create(req.body);
    res.status(201).json({ patient_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const affected = await PatientModel.update(req.params.id, req.body);
    if (!affected)
      return res.status(404).json({ message: "Patient not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const affected = await PatientModel.remove(req.params.id);
    if (!affected)
      return res.status(404).json({ message: "Patient not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
