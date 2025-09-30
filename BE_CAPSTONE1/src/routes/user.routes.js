import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  getMe,
  updateMe,
} from "../controllers/user.controller.js";
import { verifyToken, requireRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin
router.get("/", verifyToken, requireRoles("admin"), getAllUsers);
router.get("/:id", verifyToken, requireRoles("admin"), getUserById);
router.post("/", verifyToken, requireRoles("admin"), createUser);
router.put("/:id", verifyToken, requireRoles("admin"), updateUser);
router.delete("/:id", verifyToken, requireRoles("admin"), deleteUser);
router.patch("/:id/restore", verifyToken, requireRoles("admin"), restoreUser);

// User tự quản lý
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

export default router;
