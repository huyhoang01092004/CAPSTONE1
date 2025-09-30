import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // ✅ Validate password
  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      special: /[@$!%*?&]/.test(password),
    };
  };

  // ✅ Validate phone
  const validatePhone = (phone) => {
    return /^0\d{9}$/.test(phone); // bắt đầu bằng 0 + 10 số
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check confirm password
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Check password strength
    const pwdCheck = validatePassword(form.password);
    if (!pwdCheck.length || !pwdCheck.special) {
      setError("Mật khẩu phải trên 8 ký tự và có ít nhất 1 ký tự đặc biệt");
      return;
    }

    // Check phone
    if (!validatePhone(form.phone)) {
      setError("Số điện thoại phải có 10 số và bắt đầu bằng 0");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        return;
      }

      setSuccess("🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Lỗi server, vui lòng thử lại sau");
    }
  };

  const pwdCheck = validatePassword(form.password);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-green-500 mb-6">
            Đăng Ký Tài Khoản
          </h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mb-4">{success}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nguyễn"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Văn A"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0912345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
              {/* ✅ Gợi ý kiểm tra */}
              <ul className="mt-2 text-xs">
                <li
                  className={
                    pwdCheck.length ? "text-green-600" : "text-red-500"
                  }
                >
                  {pwdCheck.length ? "✔" : "✘"} Ít nhất 8 ký tự
                </li>
                <li
                  className={
                    pwdCheck.special ? "text-green-600" : "text-red-500"
                  }
                >
                  {pwdCheck.special ? "✔" : "✘"} Chứa ký tự đặc biệt (@$!%*?&)
                </li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Đăng Ký
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Đã có tài khoản?
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

export default RegisterPage;
