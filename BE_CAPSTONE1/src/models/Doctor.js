import db from "../config/db.js";

export const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT d.doctor_id, d.bio, d.office_room, d.department_id,
            d.specialties, d.languages, d.education, d.experience, d.research,
            u.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name, 
            u.avatar_url, u.phone, u.email,   -- 👈 thêm phone & email
            dept.name AS department_name,
            IFNULL(ROUND(AVG(r.rating),1),0) AS rating, 
            COUNT(r.review_id) AS reviewCount
     FROM doctors d
     JOIN users u ON d.user_id = u.user_id
     LEFT JOIN departments dept ON d.department_id = dept.department_id
     LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
     GROUP BY d.doctor_id, u.user_id, u.first_name, u.last_name, 
              u.avatar_url, u.phone, u.email, dept.name`
  );
  return rows;
};

// Lấy bác sĩ theo ID kèm rating + reviewCount
export const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT d.doctor_id, d.bio, d.office_room, d.department_id,
            d.specialties, d.languages, d.education, d.experience, d.research,
            u.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name, 
            u.avatar_url, u.phone, u.email,   -- 👈 thêm phone & email
            dept.name AS department_name,
            IFNULL(ROUND(AVG(r.rating),1),0) AS rating, 
            COUNT(r.review_id) AS reviewCount
     FROM doctors d
     JOIN users u ON d.user_id = u.user_id
     LEFT JOIN departments dept ON d.department_id = dept.department_id
     LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
     WHERE d.doctor_id = ?
     GROUP BY d.doctor_id, u.user_id, u.first_name, u.last_name, 
              u.avatar_url, u.phone, u.email, dept.name`,
    [id]
  );
  return rows[0];
};
// Tạo bác sĩ
export const create = async (data) => {
  const {
    user_id,
    bio,
    office_room,
    department_id,
    specialties,
    languages,
    education,
    experience,
    research,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO doctors 
     (user_id, bio, office_room, department_id, specialties, languages, education, experience, research, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      user_id,
      bio,
      office_room,
      department_id,
      JSON.stringify(specialties || []),
      JSON.stringify(languages || []),
      JSON.stringify(education || []),
      JSON.stringify(experience || []),
      JSON.stringify(research || []),
    ]
  );

  return result.insertId;
};

// Cập nhật bác sĩ
export const update = async (id, data) => {
  const {
    bio,
    office_room,
    department_id,
    specialties,
    languages,
    education,
    experience,
    research,
  } = data;

  const [result] = await db.execute(
    `UPDATE doctors 
     SET bio=?, office_room=?, department_id=?, specialties=?, languages=?, education=?, experience=?, research=?, updated_at=NOW()
     WHERE doctor_id=?`,
    [
      bio,
      office_room,
      department_id,
      JSON.stringify(specialties || []),
      JSON.stringify(languages || []),
      JSON.stringify(education || []),
      JSON.stringify(experience || []),
      JSON.stringify(research || []),
      id,
    ]
  );

  return result.affectedRows;
};

// Xóa bác sĩ
export const remove = async (id) => {
  const [result] = await db.execute(`DELETE FROM doctors WHERE doctor_id = ?`, [
    id,
  ]);
  return result.affectedRows;
};
export const findByDepartment = async (departmentId) => {
  const [rows] = await db.execute(
    `SELECT d.doctor_id, d.bio, d.office_room, d.department_id,
            u.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name, 
            u.avatar_url, u.phone, u.email,
            dept.name AS department_name,
            IFNULL(ROUND(AVG(r.rating),1),0) AS rating, 
            COUNT(r.review_id) AS reviewCount
     FROM doctors d
     JOIN users u ON d.user_id = u.user_id
     LEFT JOIN departments dept ON d.department_id = dept.department_id
     LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
     WHERE d.department_id = ?
     GROUP BY d.doctor_id, u.user_id, u.first_name, u.last_name, 
              u.avatar_url, u.phone, u.email, dept.name`,
    [departmentId]
  );
  return rows;
};
