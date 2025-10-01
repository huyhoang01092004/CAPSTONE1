import * as PatientModel from "../models/Patient.js";
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

// 📌 Lấy bệnh nhân theo user_id
export const getPatientByUserId = async (req, res) => {
  try {
    const patient = await PatientModel.findByUserId(req.params.userId);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found for this user" });
    }
    res.json({ success: true, data: patient });
  } catch (err) {
    console.error("❌ getPatientByUserId error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Tạo bệnh nhân mới (có user_id)
export const createPatient = async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });
    }

    const id = await PatientModel.create(req.body);
    res.status(201).json({ success: true, patient_id: id });
  } catch (err) {
    console.error("❌ createPatient error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Tạo bệnh nhân guest (đặt lịch cho người khác)
export const createGuestPatient = async (req, res) => {
  try {
    const { full_name, phone, email, dob, gender, allergies, medical_history } =
      req.body;

    // gọi model để tạo user guest + patient
    const id = await PatientModel.createGuest(
      { full_name, phone, email, dob, gender },
      { allergies, medical_history }
    );

    res.status(201).json({ success: true, patient_id: id });
  } catch (err) {
    console.error("❌ createGuestPatient error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Cập nhật bệnh nhân
export const updatePatient = async (req, res) => {
  try {
    const affected = await PatientModel.update(req.params.id, req.body);
    if (!affected) {
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
