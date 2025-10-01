import db from "../config/db.js";

// ================= LẤY DANH SÁCH TẤT CẢ BỆNH NHÂN =================
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

// ================= LẤY THEO patient_id =================
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

// ================= LẤY THEO user_id =================
export const findByUserId = async (userId) => {
  const [rows] = await db.execute(
    `SELECT p.*, 
            CONCAT(u.first_name, ' ', u.last_name) AS full_name,
            u.email, u.phone, u.gender, u.dob, u.avatar_url
     FROM patients p
     JOIN users u ON p.user_id = u.user_id
     WHERE p.user_id = ? AND u.is_active = 1`,
    [userId]
  );
  return rows[0];
};

// ================= TẠO BỆNH NHÂN (đã có user_id) =================
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

// ================= CẬP NHẬT BỆNH NHÂN =================
export const update = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.insurance_number !== undefined) {
    fields.push("insurance_number = ?");
    values.push(data.insurance_number);
  }
  if (data.blood_type !== undefined) {
    fields.push("blood_type = ?");
    values.push(data.blood_type);
  }
  if (data.allergies !== undefined) {
    fields.push("allergies = ?");
    values.push(data.allergies);
  }
  if (data.medical_history !== undefined) {
    fields.push("medical_history = ?");
    values.push(data.medical_history);
  }
  if (data.emergency_full_name !== undefined) {
    fields.push("emergency_full_name = ?");
    values.push(data.emergency_full_name);
  }
  if (data.emergency_phone !== undefined) {
    fields.push("emergency_phone = ?");
    values.push(data.emergency_phone);
  }
  if (data.emergency_relationship !== undefined) {
    fields.push("emergency_relationship = ?");
    values.push(data.emergency_relationship);
  }

  fields.push("updated_at = NOW()");
  const sql = `UPDATE patients SET ${fields.join(", ")} WHERE patient_id = ?`;
  values.push(id);

  const [result] = await db.execute(sql, values);
  return result.affectedRows;
};

// ================= XÓA MỀM BỆNH NHÂN =================
export const remove = async (id) => {
  const [result] = await db.execute(
    `UPDATE users 
     SET is_active = 0, updated_at = NOW()
     WHERE user_id = (SELECT user_id FROM patients WHERE patient_id = ?)`,
    [id]
  );
  return result.affectedRows;
};
export const createGuest = async (userData, patientData) => {
  const parts = (userData.full_name || "").trim().split(/\s+/);
  const firstName = parts.length > 1 ? parts.pop() : parts[0];
  const lastName = parts.length > 0 ? parts.join(" ") : "";

  const guestPassword = "GUEST_" + Math.random().toString(36).slice(-8);

  const [resUser] = await db.execute(
    `INSERT INTO users 
      (first_name, last_name, email, phone, gender, dob, password, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [
      firstName || null,
      lastName || null,
      userData.email || null,
      userData.phone || null,
      userData.gender || null,
      userData.dob || null,
      guestPassword,
    ]
  );

  const userId = resUser.insertId;

  await db.execute(
    `INSERT INTO user_role (user_id, role_id, assigned_at) VALUES (?, ?, NOW())`,
    [userId, 4]
  );

  const [resPatient] = await db.execute(
    `INSERT INTO patients (user_id, allergies, medical_history, created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [userId, patientData.allergies || null, patientData.medical_history || null]
  );

  return resPatient.insertId;
};
