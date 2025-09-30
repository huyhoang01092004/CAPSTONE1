import React, { useState } from "react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gửi email thất bại");
        return;
      }

      setMessage("✅ Vui lòng kiểm tra email để đặt lại mật khẩu.");
    } catch (err) {
      setError("Lỗi server, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-green-500 mb-6">
          Quên Mật Khẩu
        </h1>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {message && (
          <div className="text-green-600 text-sm mb-4">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập email của bạn
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="email@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            Gửi Yêu Cầu
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
