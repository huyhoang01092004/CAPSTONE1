import * as Department from "../models/Department.js";

// Lấy tất cả khoa
export const getDepartments = async (req, res) => {
  try {
    const rows = await Department.findAll();
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách khoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy chi tiết khoa
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Không tìm thấy khoa" });
    }

    const doctors = await Department.findDoctorsByDepartment(id);

    res.json({
      id: department.department_id,
      name: department.name,
      description: department.description,
      doctorCount: doctors.length,
      head_doctor: department.head_doctor_name || null,
      established_year: department.established_year,
      phone: department.phone,
      email: department.email,
      services: department.services ? JSON.parse(department.services) : [],
      equipments: department.equipments
        ? JSON.parse(department.equipments)
        : [],
      doctors: doctors,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết khoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo khoa
export const createDepartment = async (req, res) => {
  try {
    const id = await Department.create(req.body);
    res.status(201).json({ message: "✅ Tạo khoa thành công", id });
  } catch (err) {
    console.error("❌ Lỗi khi tạo khoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật khoa
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Department.update(id, req.body);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy khoa" });
    }

    res.json({ message: "✅ Cập nhật khoa thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật khoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa khoa
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Department.remove(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy khoa" });
    }

    res.json({ message: "🗑️ Xóa khoa thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa khoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
