import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [emailHistory, setEmailHistory] = useState([]);
  const navigate = useNavigate();

  // ✅ Lấy email history từ localStorage khi load trang
  useEffect(() => {
    const savedEmails = JSON.parse(localStorage.getItem("emailHistory")) || [];
    setEmailHistory(savedEmails);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      // ✅ Lưu token & user info
      const storage = remember ? localStorage : sessionStorage;
      // ✅ Lưu token & user info luôn vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      // ✅ Lưu email vào history (không trùng lặp)
      let savedEmails = JSON.parse(localStorage.getItem("emailHistory")) || [];
      if (identifier && !savedEmails.includes(identifier)) {
        savedEmails.push(identifier);
        localStorage.setItem("emailHistory", JSON.stringify(savedEmails));
        setEmailHistory(savedEmails);
      }

      // ✅ Điều hướng theo role
      switch (data.user.role) {
        case "admin":
          navigate("/admin/dashboard", { state: { user: data.user } });
          break;
        case "doctor":
          navigate("/doctor/dashboard", { state: { user: data.user } });
          break;
        case "patient":
        default:
          navigate("/", { state: { user: data.user } });
          break;
      }
    } catch (err) {
      setError("Lỗi server, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-green-500 mb-6">
            Đăng Nhập
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                list="email-suggestions"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com"
                required
              />
              <datalist id="email-suggestions">
                {emailHistory.map((email, idx) => (
                  <option key={idx} value={email} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-500"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Đăng Nhập
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Chưa có tài khoản?
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500 ml-1"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
