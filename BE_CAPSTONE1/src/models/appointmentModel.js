// src/models/appointmentModel.js
import db from "../config/db.js";

// 📌 Lấy tất cả lịch hẹn (có join tên bệnh nhân, bác sĩ, khoa)
export const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.department_id,
            DATE_FORMAT(a.scheduled_start, '%Y-%m-%d %H:%i:%s') AS scheduled_start,
            DATE_FORMAT(a.scheduled_end, '%Y-%m-%d %H:%i:%s') AS scheduled_end,
            a.status,
            a.reason,
            a.booking_channel,
            a.created_by_user_id,
            a.cancellation_reason,
            a.note,
            DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
            CONCAT(pu.first_name, ' ', pu.last_name) AS patient_name,
            CONCAT(du.first_name, ' ', du.last_name) AS doctor_name,
            d.name AS department_name
     FROM appointments a
     JOIN patients p ON a.patient_id = p.patient_id
     JOIN users pu ON p.user_id = pu.user_id
     JOIN doctors doc ON a.doctor_id = doc.doctor_id
     JOIN users du ON doc.user_id = du.user_id
     JOIN departments d ON a.department_id = d.department_id
     ORDER BY a.created_at DESC`
  );
  return rows;
};

// 📌 Lấy lịch hẹn theo ID
export const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.department_id,
            DATE_FORMAT(a.scheduled_start, '%Y-%m-%d %H:%i:%s') AS scheduled_start,
            DATE_FORMAT(a.scheduled_end, '%Y-%m-%d %H:%i:%s') AS scheduled_end,
            a.status,
            a.reason,
            a.booking_channel,
            a.created_by_user_id,
            a.cancellation_reason,
            a.note,
            DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
            CONCAT(pu.first_name, ' ', pu.last_name) AS patient_name,
            CONCAT(du.first_name, ' ', du.last_name) AS doctor_name,
            d.name AS department_name
     FROM appointments a
     JOIN patients p ON a.patient_id = p.patient_id
     JOIN users pu ON p.user_id = pu.user_id
     JOIN doctors doc ON a.doctor_id = doc.doctor_id
     JOIN users du ON doc.user_id = du.user_id
     JOIN departments d ON a.department_id = d.department_id
     WHERE a.appointment_id = ?`,
    [id]
  );
  return rows[0];
};

// 📌 Tạo mới lịch hẹn (FIXED undefined -> null)
export const create = async (data) => {
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
  } = data;

  const [result] = await db.execute(
    `INSERT INTO appointments 
     (patient_id, doctor_id, department_id, scheduled_start, scheduled_end, status, reason, booking_channel, created_by_user_id, note, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      patient_id ?? null,
      doctor_id ?? null,
      department_id ?? null,
      scheduled_start ?? null,
      scheduled_end ?? null,
      status ?? "pending", // mặc định pending
      reason ?? null,
      booking_channel ?? "web", // mặc định web
      created_by_user_id ?? null,
      note ?? null,
    ]
  );

  return await findById(result.insertId);
};

// 📌 Cập nhật lịch hẹn (FIXED undefined -> null)
export const update = async (id, data) => {
  const {
    patient_id,
    doctor_id,
    department_id,
    scheduled_start,
    scheduled_end,
    status,
    reason,
    booking_channel,
    cancellation_reason,
    note,
  } = data;

  const [result] = await db.execute(
    `UPDATE appointments SET 
      patient_id=?, doctor_id=?, department_id=?, scheduled_start=?, scheduled_end=?, 
      status=?, reason=?, booking_channel=?, cancellation_reason=?, note=?, updated_at=NOW()
     WHERE appointment_id=?`,
    [
      patient_id ?? null,
      doctor_id ?? null,
      department_id ?? null,
      scheduled_start ?? null,
      scheduled_end ?? null,
      status ?? "pending",
      reason ?? null,
      booking_channel ?? "web",
      cancellation_reason ?? null,
      note ?? null,
      id,
    ]
  );

  if (result.affectedRows > 0) {
    return await findById(id);
  }
  return null;
};

// 📌 Hủy lịch hẹn
export const remove = async (
  id,
  cancellation_reason = "Cancelled by system"
) => {
  const [result] = await db.execute(
    `UPDATE appointments 
     SET status='cancelled', cancellation_reason=?, updated_at=NOW()
     WHERE appointment_id=?`,
    [cancellation_reason, id]
  );
  return result.affectedRows;
};

// 📌 Kiểm tra bác sĩ có lịch trống hay không
export const isTimeSlotAvailable = async (doctor_id, start, end) => {
  const [rows] = await db.execute(
    `SELECT 1 
     FROM appointments 
     WHERE doctor_id = ? 
       AND status IN ('pending','confirmed') 
       AND (scheduled_start < ? AND scheduled_end > ?)`,
    [doctor_id, end, start]
  );
  return rows.length === 0; // true = available
};
