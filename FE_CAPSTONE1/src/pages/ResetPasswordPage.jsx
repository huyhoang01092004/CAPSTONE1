import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token"); // ✅ lấy token từ URL

  const validatePassword = (password) => {
    return /^(?=.*[@$!%*?&]).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Mật khẩu phải trên 8 ký tự và có ít nhất 1 ký tự đặc biệt");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đặt lại mật khẩu thất bại");
        return;
      }

      setSuccess("🎉 Đặt lại mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Lỗi server, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-green-500 mb-6">
            Đặt Lại Mật Khẩu
          </h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mb-4">{success}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Lưu mật khẩu mới
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Nhớ mật khẩu?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 ml-1"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
