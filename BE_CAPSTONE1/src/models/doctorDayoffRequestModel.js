import db from "../config/db.js";

// Bác sĩ gửi yêu cầu nghỉ
export const createDayoffRequest = async (
  doctor_id,
  start_at,
  end_at,
  reason
) => {
  const [res] = await db.execute(
    `INSERT INTO doctor_dayoff_requests (doctor_id, start_at, end_at, reason) VALUES (?, ?, ?, ?)`,
    [doctor_id, start_at, end_at, reason]
  );
  return res.insertId;
};

// Admin duyệt hoặc từ chối
export const updateDayoffRequest = async (request_id, status, admin_id) => {
  const [res] = await db.execute(
    `UPDATE doctor_dayoff_requests SET status=?, admin_id=?, reviewed_at=NOW() WHERE request_id=?`,
    [status, admin_id, request_id]
  );
  return res.affectedRows;
};

export const getDayoffRequests = async (doctor_id) => {
  let sql = `SELECT * FROM doctor_dayoff_requests`;
  const params = [];
  if (doctor_id) {
    sql += ` WHERE doctor_id=?`;
    params.push(doctor_id);
  }
  const [rows] = await db.execute(sql, params);
  return rows;
};
