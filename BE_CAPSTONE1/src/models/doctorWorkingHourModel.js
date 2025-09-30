import db from "../config/db.js";

// CRUD cho giờ làm việc
export const createWorkingHour = async (
  doctor_id,
  day_of_week,
  start_time,
  end_time,
  location_id,
  note
) => {
  const [res] = await db.execute(
    `INSERT INTO doctor_working_hours (doctor_id, day_of_week, start_time, end_time, location_id, note) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [doctor_id, day_of_week, start_time, end_time, location_id, note]
  );
  return res.insertId;
};

export const getWorkingHours = async (doctor_id, day_of_week) => {
  let sql = `SELECT * FROM doctor_working_hours WHERE doctor_id = ?`;
  const params = [doctor_id];
  if (day_of_week !== undefined) {
    sql += ` AND day_of_week = ?`;
    params.push(day_of_week);
  }
  const [rows] = await db.execute(sql, params);
  return rows;
};

export const updateWorkingHour = async (
  work_id,
  start_time,
  end_time,
  location_id,
  note
) => {
  const [res] = await db.execute(
    `UPDATE doctor_working_hours SET start_time=?, end_time=?, location_id=?, note=? WHERE work_id=?`,
    [start_time, end_time, location_id, note, work_id]
  );
  return res.affectedRows;
};

export const deleteWorkingHour = async (work_id) => {
  const [res] = await db.execute(
    `DELETE FROM doctor_working_hours WHERE work_id=?`,
    [work_id]
  );
  return res.affectedRows;
};
