import express from "express";
import {
  register,
  login,
  me,
  verifyEmail,
  forgotPassword, // ✅ thêm
  resetPassword, // ✅ thêm
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify", verifyEmail);
router.post("/login", login);
router.get("/me", verifyToken, me);

// =================== Forgot / Reset Password ===================
router.post("/forgot-password", forgotPassword); // nhập email để gửi link reset
router.post("/reset-password", resetPassword); // đổi mật khẩu bằng token

export default router;
