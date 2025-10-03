import db from "../config/db.js";

// ================= LẤY DANH SÁCH TẤT CẢ BỆNH NHÂN =================
export const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT p.*, 
            CONCAT(u.last_name, ' ', u.first_name) AS full_name,
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
            CONCAT(u.last_name, ' ', u.first_name) AS full_name,
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
            CONCAT(u.last_name, ' ', u.first_name) AS full_name,
            u.email, u.phone, u.gender, u.dob, u.avatar_url
     FROM patients p
     JOIN users u ON p.user_id = u.user_id
     WHERE p.user_id = ? AND u.is_active = 1`,
    [userId]
  );
  return rows[0];
};

// ================= AUTO GET OR CREATE PATIENT =================
export const getOrCreateByUserId = async (userId) => {
  let patient = await findByUserId(userId);
  if (!patient) {
    const [result] = await db.execute(
      `INSERT INTO patients (user_id, created_at, updated_at)
       VALUES (?, NOW(), NOW())`,
      [userId]
    );
    patient = await findById(result.insertId);
  }
  return patient;
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
     (user_id, insurance_number, blood_type, allergies, medical_history, 
      emergency_full_name, emergency_phone, emergency_relationship, 
      created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      user_id,
      insurance_number ?? null,
      blood_type ?? null,
      allergies ?? null,
      medical_history ?? null,
      emergency_full_name ?? null,
      emergency_phone ?? null,
      emergency_relationship ?? null,
    ]
  );

  return result.insertId;
};

// ================= CẬP NHẬT PROFILE (users + patients) =================
export const updateProfile = async (id, data) => {
  const [patient] = await db.execute(
    `SELECT user_id FROM patients WHERE patient_id = ?`,
    [id]
  );
  if (!patient.length) return 0;

  const userId = patient[0].user_id;

  // ✅ Chuẩn hóa dob nếu có
  let dob = data.dob ? new Date(data.dob).toISOString().split("T")[0] : null;

  // ✅ Tách họ tên chuẩn
  let firstName = null;
  let lastName = null;
  if (data.full_name) {
    const parts = data.full_name.trim().split(/\s+/);
    firstName = parts.length > 0 ? parts[parts.length - 1] : null;
    lastName = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;
  }

  // update users (fix undefined → null)
  await db.execute(
    `UPDATE users 
     SET first_name = COALESCE(?, first_name),
         last_name = COALESCE(?, last_name),
         email = COALESCE(?, email),
         phone = COALESCE(?, phone),
         gender = COALESCE(?, gender),
         dob = COALESCE(?, dob),
         avatar_url = COALESCE(?, avatar_url),
         updated_at = NOW()
     WHERE user_id = ?`,
    [
      firstName ?? null,
      lastName ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.gender ?? null,
      dob ?? null,
      data.avatar_url ?? null,
      userId,
    ]
  );

  // update patients (fix undefined → null)
  const fields = [];
  const values = [];

  if (data.insurance_number !== undefined) {
    fields.push("insurance_number = ?");
    values.push(data.insurance_number ?? null);
  }
  if (data.blood_type !== undefined) {
    fields.push("blood_type = ?");
    values.push(data.blood_type ?? null);
  }
  if (data.allergies !== undefined) {
    fields.push("allergies = ?");
    values.push(data.allergies ?? null);
  }
  if (data.medical_history !== undefined) {
    fields.push("medical_history = ?");
    values.push(data.medical_history ?? null);
  }
  if (data.emergency_full_name !== undefined) {
    fields.push("emergency_full_name = ?");
    values.push(data.emergency_full_name ?? null);
  }
  if (data.emergency_phone !== undefined) {
    fields.push("emergency_phone = ?");
    values.push(data.emergency_phone ?? null);
  }
  if (data.emergency_relationship !== undefined) {
    fields.push("emergency_relationship = ?");
    values.push(data.emergency_relationship ?? null);
  }

  if (fields.length > 0) {
    fields.push("updated_at = NOW()");
    const sql = `UPDATE patients SET ${fields.join(", ")} WHERE patient_id = ?`;
    values.push(id);
    await db.execute(sql, values);
  }

  return 1;
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

// ================= TẠO BỆNH NHÂN KHÁCH =================
export const createGuest = async (userData, patientData) => {
  const parts = (userData.full_name || "").trim().split(/\s+/);
  const firstName = parts.length > 0 ? parts[parts.length - 1] : null;
  const lastName = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;

  const guestPassword = "GUEST_" + Math.random().toString(36).slice(-8);

  // ✅ Check email đã tồn tại chưa (và phải active)
  let userId = null;
  if (userData.email) {
    const [exist] = await db.execute(
      `SELECT user_id FROM users WHERE email = ? AND is_active = 1 LIMIT 1`,
      [userData.email]
    );
    if (exist.length > 0) {
      userId = exist[0].user_id;
    }
  }

  // Nếu chưa tồn tại thì tạo mới user
  if (!userId) {
    const [resUser] = await db.execute(
      `INSERT INTO users 
        (first_name, last_name, email, phone, gender, dob, password, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        firstName ?? null,
        lastName ?? null,
        userData.email ?? null,
        userData.phone ?? null,
        userData.gender ?? null,
        userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : null,
        guestPassword,
      ]
    );
    userId = resUser.insertId;

    await db.execute(
      `INSERT INTO user_role (user_id, role_id, assigned_at) VALUES (?, ?, NOW())`,
      [userId, 4] // role_id = 4 = patient guest
    );
  }

  // ✅ Check user đã có patient chưa
  const [existPatient] = await db.execute(
    `SELECT patient_id FROM patients WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  if (existPatient.length > 0) {
    return await findById(existPatient[0].patient_id);
  }

  // Nếu chưa có thì tạo patient
  const [resPatient] = await db.execute(
    `INSERT INTO patients (user_id, allergies, medical_history, created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [userId, patientData.allergies ?? null, patientData.medical_history ?? null]
  );

  return await findById(resPatient.insertId);
};
