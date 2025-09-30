import db from "../config/db.js";

// Lấy tất cả user chưa bị xóa
export const getAll = async () => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone,
            u.is_active, rl.code AS role
     FROM users u
     JOIN user_roles ur ON u.user_id = ur.user_id
     JOIN roles rl ON ur.role_id = rl.role_id
     WHERE u.deleted_at IS NULL`
  );
  return rows;
};

// Lấy user theo ID
export const getById = async (id) => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone,
            u.is_active, rl.code AS role
     FROM users u
     JOIN user_roles ur ON u.user_id = ur.user_id
     JOIN roles rl ON ur.role_id = rl.role_id
     WHERE u.user_id=? AND u.deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Lấy user theo email
export const getByEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT u.*, rl.code AS role_code
     FROM users u
     JOIN user_roles ur ON u.user_id = ur.user_id
     JOIN roles rl ON ur.role_id = rl.role_id
     WHERE u.email=? AND u.deleted_at IS NULL
     LIMIT 1`,
    [email]
  );
  return rows[0];
};

// Tạo user
export const create = async ({
  first_name,
  last_name,
  email,
  phone,
  password,
  role_id,
}) => {
  const [result] = await db.execute(
    `INSERT INTO users(first_name,last_name,email,phone,password,is_active,created_at,updated_at)
     VALUES(?,?,?,?,?,1,NOW(),NOW())`,
    [first_name, last_name, email, phone, password]
  );
  await db.execute(
    "INSERT INTO user_roles(user_id, role_id, assigned_at) VALUES(?, ?, NOW())",
    [result.insertId, role_id]
  );
  return result.insertId;
};

// Cập nhật user
export const update = async (
  id,
  { first_name, last_name, phone, is_active, role_id }
) => {
  await db.execute(
    `UPDATE users SET first_name=?, last_name=?, phone=?, is_active=?, updated_at=NOW()
     WHERE user_id=? AND deleted_at IS NULL`,
    [first_name, last_name, phone, is_active, id]
  );
  if (role_id) {
    await db.execute(
      "UPDATE user_roles SET role_id=?, assigned_at=NOW() WHERE user_id=?",
      [role_id, id]
    );
  }
};

// Xóa mềm user
export const softDelete = async (id) => {
  await db.execute(
    "UPDATE users SET deleted_at=NOW(), is_active=0 WHERE user_id=?",
    [id]
  );
};

// Khôi phục user
export const restore = async (id) => {
  await db.execute(
    "UPDATE users SET deleted_at=NULL, is_active=1 WHERE user_id=?",
    [id]
  );
};
