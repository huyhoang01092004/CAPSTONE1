import express from "express";
import {
  register,
  login,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword, // ✅ thêm
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// =================== Auth ===================
router.post("/register", register); // Đăng ký
router.get("/verify", verifyEmail); // Xác thực email
router.post("/login", login); // Đăng nhập
router.get("/me", verifyToken, me); // Lấy profile từ token

// =================== Forgot / Reset Password ===================
router.post("/forgot-password", forgotPassword); // Nhập email để gửi link reset
router.post("/reset-password", resetPassword); // Đổi mật khẩu bằng token gửi qua email

// =================== Change Password (khi đã đăng nhập) ===================
router.post("/change-password", verifyToken, changePassword);
router.put("/change-password", verifyToken, changePassword);

export default router;
