import * as Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
      return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    res.json(doctor);
  } catch (err) {
    console.error("❌ Lỗi khi lấy bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const id = await Doctor.create(req.body);
    res.status(201).json({ message: "Tạo bác sĩ thành công", doctor_id: id });
  } catch (err) {
    console.error("❌ Lỗi khi tạo bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const rows = await Doctor.update(req.params.id, req.body);
    if (!rows) return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const rows = await Doctor.remove(req.params.id);
    if (!rows) return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
