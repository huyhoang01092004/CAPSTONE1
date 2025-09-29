import db from "../config/db.js";

// Lấy tất cả review theo doctorId
export const findByDoctor = async (doctorId) => {
  const [rows] = await db.execute(
    `SELECT r.review_id, r.rating, r.comment, r.created_at, 
            p.patient_id,
            CONCAT(u.first_name, ' ', u.last_name) AS patientName
     FROM doctor_reviews r
     JOIN Patients p ON r.patient_id = p.patient_id
     JOIN Users u ON p.user_id = u.user_id
     WHERE r.doctor_id = ?
     ORDER BY r.created_at DESC`,
    [doctorId]
  );
  return rows;
};

// Lấy 1 review theo review_id
export const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT r.review_id, r.rating, r.comment, r.created_at, 
            p.patient_id,
            CONCAT(u.first_name, ' ', u.last_name) AS patientName
     FROM doctor_reviews r
     JOIN Patients p ON r.patient_id = p.patient_id
     JOIN Users u ON p.user_id = u.user_id
     WHERE r.review_id = ?`,
    [id]
  );
  return rows[0];
};

// Thêm review mới
export const create = async (data) => {
  const { appointment_id, patient_id, doctor_id, rating, comment } = data;
  const [result] = await db.execute(
    `INSERT INTO doctor_reviews (appointment_id, patient_id, doctor_id, rating, comment, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [appointment_id, patient_id, doctor_id, rating, comment]
  );
  return result.insertId;
};

// Cập nhật review
export const update = async (id, data) => {
  const { rating, comment } = data;
  const [result] = await db.execute(
    `UPDATE doctor_reviews 
     SET rating = ?, comment = ? 
     WHERE review_id = ?`,
    [rating, comment, id]
  );
  return result.affectedRows;
};

// Xóa review
export const remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM doctor_reviews WHERE review_id = ?`,
    [id]
  );
  return result.affectedRows;
};
