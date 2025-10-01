// src/models/appointmentModel.js
import db from "../config/db.js";

// ================== BASE QUERY ==================
const baseSelect = `
  SELECT a.appointment_id,
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
`;

// ================== LẤY TẤT CẢ ==================
export const findAll = async () => {
  const [rows] = await db.execute(`${baseSelect} ORDER BY a.created_at DESC`);
  return rows;
};

// ================== LẤY THEO ID ==================
export const findById = async (id) => {
  const [rows] = await db.execute(`${baseSelect} WHERE a.appointment_id = ?`, [
    id,
  ]);
  return rows[0];
};

// ================== TẠO MỚI ==================
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

// ================== CẬP NHẬT ==================
export const update = async (id, data) => {
  const oldData = await findById(id);
  if (!oldData) return null;

  const {
    patient_id = oldData.patient_id,
    doctor_id = oldData.doctor_id,
    department_id = oldData.department_id,
    scheduled_start = oldData.scheduled_start,
    scheduled_end = oldData.scheduled_end,
    status = oldData.status,
    reason = oldData.reason,
    booking_channel = oldData.booking_channel,
    cancellation_reason = oldData.cancellation_reason,
    note = oldData.note,
  } = data;

  const [result] = await db.execute(
    `UPDATE appointments SET 
      patient_id=?, doctor_id=?, department_id=?, scheduled_start=?, scheduled_end=?, 
      status=?, reason=?, booking_channel=?, cancellation_reason=?, note=?, updated_at=NOW()
     WHERE appointment_id=?`,
    [
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
      id,
    ]
  );

  return result.affectedRows > 0 ? await findById(id) : null;
};

// ================== HỦY ==================
export const cancel = async (id, reason = "Cancelled by system") => {
  const [result] = await db.execute(
    `UPDATE appointments 
     SET status='cancelled', cancellation_reason=?, updated_at=NOW()
     WHERE appointment_id=?`,
    [reason, id]
  );
  return result.affectedRows;
};

// ================== CHECK TRỐNG SLOT ==================
export const isTimeSlotAvailable = async (doctor_id, start, end) => {
  const [rows] = await db.execute(
    `SELECT 1 
     FROM appointments 
     WHERE doctor_id = ? 
       AND status IN ('pending','confirmed') 
       AND (scheduled_start < ? AND scheduled_end > ?)`,
    [doctor_id, end, start]
  );
  return rows.length === 0;
};

// ================== LẤY THEO USER ==================
export const findByUser = async (userId, mode = "both") => {
  let condition = "";
  if (mode === "creator") condition = "a.created_by_user_id = ?";
  else if (mode === "patient") condition = "p.user_id = ?";
  else condition = "a.created_by_user_id = ? OR p.user_id = ?";

  const [rows] = await db.execute(
    `${baseSelect} WHERE ${condition} ORDER BY a.scheduled_start DESC`,
    mode === "both" ? [userId, userId] : [userId]
  );
  return rows;
};
