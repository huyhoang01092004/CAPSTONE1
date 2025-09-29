import db from "../config/db.js";

export const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT p.*, 
            CONCAT(u.first_name, ' ', u.last_name) AS full_name,
            u.email, u.phone, u.gender, u.dob, u.avatar_url
     FROM patients p
     JOIN users u ON p.user_id = u.user_id
     WHERE u.is_active = 1
     ORDER BY p.created_at DESC`
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT p.*, 
            CONCAT(u.first_name, ' ', u.last_name) AS full_name,
            u.email, u.phone, u.gender, u.dob, u.avatar_url
     FROM patients p
     JOIN users u ON p.user_id = u.user_id
     WHERE p.patient_id = ? AND u.is_active = 1`,
    [id]
  );
  return rows[0];
};

// Tạo bệnh nhân mới
export const create = async (data) => {
  const {
    user_id,
    insurance_number,
    blood_type,
    allergies,
    medical_history,
    emergency_full_name,
    emergency_phone,
    emergency_relationship,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO patients 
     (user_id, insurance_number, blood_type, allergies, medical_history, emergency_full_name, emergency_phone, emergency_relationship, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      user_id,
      insurance_number,
      blood_type,
      allergies,
      medical_history,
      emergency_full_name,
      emergency_phone,
      emergency_relationship,
    ]
  );

  return result.insertId;
};

// Cập nhật bệnh nhân
export const update = async (id, data) => {
  const {
    insurance_number,
    blood_type,
    allergies,
    medical_history,
    emergency_full_name,
    emergency_phone,
    emergency_relationship,
  } = data;

  const [result] = await db.execute(
    `UPDATE patients 
     SET insurance_number=?, blood_type=?, allergies=?, medical_history=?, 
         emergency_full_name=?, emergency_phone=?, emergency_relationship=?, updated_at=NOW()
     WHERE patient_id=?`,
    [
      insurance_number,
      blood_type,
      allergies,
      medical_history,
      emergency_full_name,
      emergency_phone,
      emergency_relationship,
      id,
    ]
  );

  return result.affectedRows;
};

// Xóa bệnh nhân (soft delete qua users)
export const remove = async (id) => {
  const [result] = await db.execute(
    `UPDATE users 
     SET is_active = 0, updated_at = NOW()
     WHERE user_id = (SELECT user_id FROM patients WHERE patient_id = ?)`,
    [id]
  );
  return result.affectedRows;
};
