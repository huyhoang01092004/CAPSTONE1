import db from "../config/db.js";

// Lấy tất cả khoa
export const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT d.department_id, d.name, d.description, d.established_year, d.phone, d.email,
            CONCAT(u.first_name, ' ', u.last_name) AS head_doctor,
            COUNT(DISTINCT doc2.doctor_id) AS doctorCount
     FROM departments d
     LEFT JOIN doctors doc ON d.head_doctor_id = doc.doctor_id
     LEFT JOIN users u ON doc.user_id = u.user_id
     LEFT JOIN doctors doc2 ON d.department_id = doc2.department_id
     GROUP BY d.department_id, d.name, d.description, d.established_year, d.phone, d.email, head_doctor`
  );
  return rows;
};
// Lấy khoa theo ID
export const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT d.department_id, d.name, d.description, d.established_year, d.phone, d.email,
            d.services, d.equipments,
            CONCAT(u.first_name, ' ', u.last_name) AS head_doctor_name
     FROM departments d
     LEFT JOIN doctors doc ON d.head_doctor_id = doc.doctor_id
     LEFT JOIN users u ON doc.user_id = u.user_id
     WHERE d.department_id = ?`,
    [id]
  );
  return rows[0];
};

// Lấy danh sách bác sĩ của khoa
export const findDoctorsByDepartment = async (id) => {
  const [rows] = await db.execute(
    `SELECT d.doctor_id AS id,
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            d.specialties AS specialty,
            u.avatar_url AS image,
            IFNULL(ROUND(AVG(r.rating),1), 0) AS rating,
            COUNT(r.review_id) AS reviewCount
     FROM doctors d
     JOIN users u ON d.user_id = u.user_id
     LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
     WHERE d.department_id = ?
     GROUP BY d.doctor_id, u.first_name, u.last_name, d.specialties, u.avatar_url`,
    [id]
  );
  return rows;
};

// Tạo khoa
export const create = async (data) => {
  const {
    name,
    description,
    established_year,
    phone,
    email,
    head_doctor_id,
    services,
    equipments,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO departments 
     (name, description, established_year, phone, email, head_doctor_id, services, equipments, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      name,
      description,
      established_year,
      phone,
      email,
      head_doctor_id || null,
      JSON.stringify(services || []),
      JSON.stringify(equipments || []),
    ]
  );

  return result.insertId;
};

// Cập nhật khoa
export const update = async (id, data) => {
  const {
    name,
    description,
    established_year,
    phone,
    email,
    head_doctor_id,
    services,
    equipments,
  } = data;

  const [result] = await db.execute(
    `UPDATE departments 
     SET name=?, description=?, established_year=?, phone=?, email=?, head_doctor_id=?, 
         services=?, equipments=?, updated_at=NOW() 
     WHERE department_id=?`,
    [
      name,
      description,
      established_year,
      phone,
      email,
      head_doctor_id || null,
      JSON.stringify(services || []),
      JSON.stringify(equipments || []),
      id,
    ]
  );

  return result.affectedRows;
};

// Xóa khoa
export const remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM departments WHERE department_id = ?`,
    [id]
  );
  return result.affectedRows;
};
