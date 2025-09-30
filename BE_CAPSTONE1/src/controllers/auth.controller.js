import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthModel from "../models/auth.model.js";
import { sendEmail } from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const EMAIL_SECRET = process.env.EMAIL_SECRET || "verify_secret";
const RESET_SECRET = process.env.RESET_SECRET || "reset_secret";

// ======================= ĐĂNG KÝ =======================
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    // ✅ Validate password
    const passwordRegex = /^(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 ký tự đặc biệt (@$!%*?&)",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = await AuthModel.createUser({
      first_name,
      last_name,
      email,
      phone,
      password: hash,
    });

    // gán role mặc định = patient
    await AuthModel.assignRole(userId, 3);

    // tạo token verify email
    const token = jwt.sign({ user_id: userId }, EMAIL_SECRET, {
      expiresIn: "1d",
    });
    const verifyLink = `http://localhost:5000/api/auth/verify?token=${token}`;

    await sendEmail(
      email,
      "Xác thực tài khoản",
      `<h3>Chào ${first_name},</h3>
       <p>Vui lòng click vào link bên dưới để xác thực tài khoản:</p>
       <a href="${verifyLink}">${verifyLink}</a>`
    );

    res.status(201).json({
      message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực",
    });
  } catch (err) {
    console.error("❌ Lỗi register:", err);
    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("email")) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      if (err.sqlMessage.includes("phone")) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
      }
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================= XÁC THỰC EMAIL =======================
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, EMAIL_SECRET);

    await AuthModel.activateUser(decoded.user_id);
    res.json({ message: "Email đã được xác thực, bạn có thể đăng nhập" });
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ======================= ĐĂNG NHẬP =======================
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await AuthModel.findByEmailOrUsername(identifier);
    if (!user)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    if (user.is_active === 0) {
      return res.status(403).json({ message: "Tài khoản chưa xác thực email" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    // 🔎 nếu role = patient thì lấy thêm patient_id
    let patient_id = null;
    if (user.role_code === "patient") {
      const patient = await AuthModel.findPatientByUserId(user.user_id);
      patient_id = patient ? patient.patient_id : null;
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role_code },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        patient_id,
        name: user.first_name + " " + user.last_name,
        email: user.email,
        role: user.role_code,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================= LẤY PROFILE =======================
export const me = async (req, res) => {
  res.json(req.auth);
};

// ======================= QUÊN MẬT KHẨU =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const token = jwt.sign({ user_id: user.user_id }, RESET_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Đặt lại mật khẩu",
      `<h3>Xin chào ${user.first_name},</h3>
       <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
       <a href="${resetLink}">${resetLink}</a>`
    );

    res.json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (err) {
    console.error("❌ Lỗi forgotPassword:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================= RESET MẬT KHẨU =======================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, RESET_SECRET);

    const passwordRegex = /^(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 ký tự đặc biệt (@$!%*?&)",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await AuthModel.updatePassword(decoded.user_id, hash);

    res.json({ message: "Mật khẩu đã được cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi resetPassword:", err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
