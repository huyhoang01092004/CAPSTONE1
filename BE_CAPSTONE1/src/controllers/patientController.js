import * as PatientModel from "../models/Patient.js";
import db from "../config/db.js";

// 📌 Lấy danh sách bệnh nhân
export const getPatients = async (req, res) => {
  try {
    const patients = await PatientModel.findAll();
    res.json({ success: true, data: patients });
  } catch (err) {
    console.error("❌ getPatients error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Lấy bệnh nhân theo patient_id
export const getPatientById = async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, data: patient });
  } catch (err) {
    console.error("❌ getPatientById error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Lấy bệnh nhân theo user_id (auto tạo nếu chưa có)
export const getPatientByUserId = async (req, res) => {
  try {
    const patient = await PatientModel.getOrCreateByUserId(req.params.userId);
    res.json({ success: true, data: patient });
  } catch (err) {
    console.error("❌ getPatientByUserId error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Tạo bệnh nhân guest (đặt lịch cho người khác)
export const createGuestPatient = async (req, res) => {
  try {
    const { full_name, phone, email, dob, gender, allergies, medical_history } =
      req.body;

    const newPatient = await PatientModel.createGuest(
      { full_name, phone, email, dob, gender },
      { allergies, medical_history }
    );

    res.status(201).json({ success: true, data: newPatient });
  } catch (err) {
    console.error("❌ createGuestPatient error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Cập nhật hồ sơ (update cả users + patients)
export const updatePatient = async (req, res) => {
  try {
    const updated = await PatientModel.updateProfile(req.params.id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, message: "Patient updated successfully" });
  } catch (err) {
    console.error("❌ updatePatient error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Xóa mềm bệnh nhân
export const deletePatient = async (req, res) => {
  try {
    const affected = await PatientModel.remove(req.params.id);
    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, message: "Patient deactivated" });
  } catch (err) {
    console.error("❌ deletePatient error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================== TẠO PATIENT CHO USER ==================
export const createPatientForUser = async (req, res) => {
  const {
    user_id,
    insurance_number,
    blood_type,
    allergies,
    medical_history,
    emergency_full_name,
    emergency_phone,
    emergency_relationship,
  } = req.body;

  try {
    // 1. Kiểm tra user có tồn tại & active
    const [users] = await db.execute(
      `SELECT * FROM users WHERE user_id = ? AND is_active = 1`,
      [user_id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found or not active",
      });
    }

    // 2. Kiểm tra user đã có patient chưa
    const existingPatient = await PatientModel.findByUserId(user_id);
    if (existingPatient) {
      return res.status(200).json({
        success: true,
        message: "Patient already exists for this user",
        data: existingPatient,
      });
    }

    // 3. Tạo mới patient
    const patientId = await PatientModel.create({
      user_id,
      insurance_number,
      blood_type,
      allergies,
      medical_history,
      emergency_full_name,
      emergency_phone,
      emergency_relationship,
    });

    const newPatient = await PatientModel.findById(patientId);

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: newPatient,
    });
  } catch (error) {
    console.error("❌ Error creating patient:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
