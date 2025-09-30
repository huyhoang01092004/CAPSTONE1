import * as User from "../models/user.model.js";

// Admin: Lấy tất cả user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin: Lấy user theo ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin: Tạo user
export const createUser = async (req, res) => {
  try {
    const id = await User.create(req.body);
    res.status(201).json({ message: "User đã được tạo", id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin: Cập nhật user
export const updateUser = async (req, res) => {
  try {
    await User.update(req.params.id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// User: Lấy thông tin cá nhân
export const getMe = async (req, res) => {
  try {
    const user = await User.getById(req.auth.user_id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// User: Cập nhật thông tin cá nhân
export const updateMe = async (req, res) => {
  try {
    await User.update(req.auth.user_id, req.body);
    res.json({ message: "Cập nhật thông tin cá nhân thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin: Xóa mềm user
export const deleteUser = async (req, res) => {
  try {
    await User.softDelete(req.params.id);
    res.json({ message: "User đã bị xóa (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin: Khôi phục user
export const restoreUser = async (req, res) => {
  try {
    await User.restore(req.params.id);
    res.json({ message: "User đã được khôi phục" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
