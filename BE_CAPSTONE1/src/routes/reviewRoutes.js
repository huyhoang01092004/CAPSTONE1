import express from "express";
import {
  getReviewsByDoctor,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Lấy tất cả review của 1 bác sĩ
router.get("/doctor/:doctorId", getReviewsByDoctor);

// Lấy 1 review
router.get("/:id", getReviewById);

// Tạo review mới
router.post("/", createReview);

// Cập nhật review
router.put("/:id", updateReview);

// Xóa review
router.delete("/:id", deleteReview);

export default router;
