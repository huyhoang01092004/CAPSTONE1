// src/controllers/appointmentController.js
import * as Appointment from "../models/appointmentModel.js";

// 📌 Lấy tất cả lịch hẹn
export const getAppointments = async (req, res) => {
  try {
    const data = await Appointment.findAll();
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi getAppointments:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// 📌 Lấy lịch hẹn theo ID
export const getAppointment = async (req, res) => {
  try {
    const data = await Appointment.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi getAppointment:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// 📌 Tạo mới lịch hẹn
export const createAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      department_id,
      scheduled_start,
      scheduled_end,
      status,
      reason,
      booking_channel,
      created_by_user_id,
      note,
    } = req.body;

    // 🔎 1. Validate input
    if (
      !patient_id ||
      !doctor_id ||
      !department_id ||
      !scheduled_start ||
      !scheduled_end
    ) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc!" });
    }

    // 🔎 2. Kiểm tra slot đã có người đặt chưa
    const available = await Appointment.isTimeSlotAvailable(
      doctor_id,
      scheduled_start,
      scheduled_end
    );

    if (!available) {
      return res.status(400).json({
        message: "❌ Slot này đã được đặt, vui lòng chọn giờ khác.",
      });
    }

    // 🆕 3. Tạo mới (ép undefined -> null)
    const appointment = await Appointment.create({
      patient_id: patient_id ?? null,
      doctor_id: doctor_id ?? null,
      department_id: department_id ?? null,
      scheduled_start: scheduled_start ?? null,
      scheduled_end: scheduled_end ?? null,
      status: status ?? "pending",
      reason: reason ?? null,
      booking_channel: booking_channel ?? "web",
      created_by_user_id: created_by_user_id ?? null,
      note: note ?? null,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("❌ Lỗi createAppointment:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// 📌 Cập nhật lịch hẹn
export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Updated successfully", appointment: updated });
  } catch (err) {
    console.error("❌ Lỗi updateAppointment:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// 📌 Hủy lịch hẹn (soft delete)
export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Lỗi deleteAppointment:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
