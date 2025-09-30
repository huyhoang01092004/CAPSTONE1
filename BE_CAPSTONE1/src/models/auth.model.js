import db from "../config/db.js";

// 🔎 Tìm user theo email (login, forgot password)
export const findByEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT u.*, rl.code AS role_code
     FROM users u
     JOIN user_role ur ON u.user_id = ur.user_id
     JOIN roles rl ON ur.role_id = rl.role_id
     WHERE u.email = ?
       AND u.deleted_at IS NULL
     LIMIT 1`,
    [email]
  );
  return rows[0];
};

// 🔎 Giữ hàm này để tương thích login trước đây (identifier = email)
export const findByEmailOrUsername = async (identifier) => {
  return findByEmail(identifier); // chỉ còn dùng email
};

// ➕ Tạo user mới
export const createUser = async ({
  first_name,
  last_name,
  email,
  phone,
  password,
}) => {
  const [result] = await db.execute(
    `INSERT INTO users(first_name, last_name, email, phone, password, is_active, created_at, updated_at)
     VALUES(?,?,?,?,?,0,NOW(),NOW())`, // mặc định is_active = 0 (chưa xác thực email)
    [first_name, last_name, email, phone, password]
  );
  return result.insertId;
};

// 👤 Gán role cho user (mặc định patient = 3)
export const assignRole = async (userId, roleId = 3) => {
  await db.execute(
    `INSERT INTO user_role(user_id, role_id, assigned_at)
     VALUES(?, ?, NOW())`,
    [userId, roleId]
  );
};

// ✅ Kích hoạt user (sau khi xác thực email)
export const activateUser = async (userId) => {
  await db.execute(
    `UPDATE users
     SET is_active = 1, updated_at = NOW()
     WHERE user_id = ?`,
    [userId]
  );
};

// 🔄 Cập nhật mật khẩu mới (reset password)
export const updatePassword = async (userId, hashPassword) => {
  await db.execute(
    `UPDATE users
     SET password = ?, updated_at = NOW()
     WHERE user_id = ?`,
    [hashPassword, userId]
  );
};
// 🔎 Lấy patient theo user_id
export const findPatientByUserId = async (userId) => {
  const [rows] = await db.execute(
    `SELECT patient_id FROM patients WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0];
};
