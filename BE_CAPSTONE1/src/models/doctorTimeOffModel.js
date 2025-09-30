import db from "../config/db.js";

// CRUD cho time off
export const createTimeOff = async (doctor_id, start_at, end_at, reason) => {
  const [res] = await db.execute(
    `INSERT INTO doctor_time_off (doctor_id, start_at, end_at, reason) VALUES (?, ?, ?, ?)`,
    [doctor_id, start_at, end_at, reason]
  );
  return res.insertId;
};

export const getTimeOff = async (doctor_id, date) => {
  const [rows] = await db.execute(
    `SELECT * FROM doctor_time_off 
     WHERE doctor_id=? AND DATE(start_at) <= ? AND DATE(end_at) >= ?`,
    [doctor_id, date, date]
  );
  return rows;
};

export const deleteTimeOff = async (timeoff_id) => {
  const [res] = await db.execute(
    `DELETE FROM doctor_time_off WHERE timeoff_id=?`,
    [timeoff_id]
  );
  return res.affectedRows;
};
