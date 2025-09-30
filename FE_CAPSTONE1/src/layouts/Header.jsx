import React, { useState, useEffect } from "react";
import { Phone, Mail, Menu, X, Bell } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy user từ state (navigate) hoặc localStorage
  useEffect(() => {
    if (location.state?.user) {
      setIsAuthenticated(true);
      setUsername(location.state.user.name);

      // Lưu vào localStorage để giữ khi F5
      localStorage.setItem("user", JSON.stringify(location.state.user));
      if (location.state.token) {
        localStorage.setItem("token", location.state.token);
      }
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUsername(user.name);
      }
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 border-b border-gray-100">
          <div className="flex space-x-4">
            <div className="flex items-center text-sm">
              <Phone size={16} className="text-green-600 mr-2" />
              <span>(123) 456-7890</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail size={16} className="text-green-600 mr-2" />
              <span>contact@healthclinic.com</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Phòng Khám Sức Khỏe
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="font-medium hover:text-green-600">
              Trang Chủ
            </Link>
            <Link to="/services" className="font-medium hover:text-green-600">
              Dịch Vụ
            </Link>
            <Link to="/doctors" className="font-medium hover:text-green-600">
              Bác Sĩ
            </Link>
            <Link to="/about" className="font-medium hover:text-green-600">
              Giới Thiệu
            </Link>
            <Link to="/contact" className="font-medium hover:text-green-600">
              Liên Hệ
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Bell */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-green-50 relative">
                <Bell size={20} className="text-green-600" />
                <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Auth */}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                >
                  Đăng Ký
                </Link>
              </>
            ) : (
              <>
                <span className="font-medium text-green-700">
                  Xin chào, {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Đăng Xuất
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
