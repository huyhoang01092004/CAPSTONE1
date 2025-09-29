import * as reviewModel from "../models/reviewModel.js";

// Lấy review theo doctorId
export const getReviewsByDoctor = async (req, res) => {
  try {
    const reviews = await reviewModel.findByDoctor(req.params.doctorId);
    res.json(reviews);
  } catch (err) {
    console.error("❌ Lỗi getReviewsByDoctor:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Lấy 1 review
export const getReviewById = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    console.error("❌ Lỗi getReviewById:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Tạo review
export const createReview = async (req, res) => {
  try {
    const id = await reviewModel.create(req.body);
    res.json({ review_id: id });
  } catch (err) {
    console.error("❌ Lỗi createReview:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Cập nhật review
export const updateReview = async (req, res) => {
  try {
    const affected = await reviewModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review updated" });
  } catch (err) {
    console.error("❌ Lỗi updateReview:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Xóa review
export const deleteReview = async (req, res) => {
  try {
    const affected = await reviewModel.remove(req.params.id);
    if (!affected) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("❌ Lỗi deleteReview:", err);
    res.status(500).json({ error: "Server error" });
  }
};
