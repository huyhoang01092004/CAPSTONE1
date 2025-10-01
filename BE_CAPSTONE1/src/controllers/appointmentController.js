// src/controllers/appointmentController.js
import * as Appointment from "../models/appointmentModel.js";

// 📌 Lấy tất cả lịch hẹn
export const getAppointments = async (req, res) => {
  try {
    const data = await Appointment.findAll();
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi getAppointments:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", details: err.message });
  }
};

// 📌 Lấy lịch hẹn theo ID
export const getAppointment = async (req, res) => {
  try {
    const data = await Appointment.findById(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi getAppointment:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", details: err.message });
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

    // 1. Validate input
    if (
      !patient_id ||
      !doctor_id ||
      !department_id ||
      !scheduled_start ||
      !scheduled_end
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu dữ liệu bắt buộc!" });
    }

    // 2. Kiểm tra slot đã có người đặt chưa
    const available = await Appointment.isTimeSlotAvailable(
      doctor_id,
      scheduled_start,
      scheduled_end
    );
    if (!available) {
      return res.status(400).json({
        success: false,
        message: "❌ Slot này đã được đặt, vui lòng chọn giờ khác.",
      });
    }

    // 3. Tạo mới
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

    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    console.error("❌ Lỗi createAppointment:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", details: err.message });
  }
};

// 📌 Cập nhật lịch hẹn
export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.update(req.params.id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    console.error("❌ Lỗi updateAppointment:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", details: err.message });
  }
};

// 📌 Hủy lịch hẹn (soft delete)
export const cancelAppointment = async (req, res) => {
  try {
    const reason = req.body?.reason || "Cancelled by user";
    const cancelled = await Appointment.cancel(req.params.id, reason);
    if (!cancelled) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Cancelled successfully" });
  } catch (err) {
    console.error("❌ Lỗi cancelAppointment:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", details: err.message });
  }
};

// 📌 Lấy tất cả appointment liên quan tới user (đặt hộ + tự đặt)
export const getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const rows = await Appointment.findByUser(userId, "both");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ getAppointmentsByUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};
