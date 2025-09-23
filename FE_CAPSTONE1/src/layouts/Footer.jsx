import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Phòng Khám Sức Khỏe</h3>
            <p className="text-gray-300 mb-4">
              Cung cấp dịch vụ chăm sóc sức khỏe chất lượng với phương pháp lấy
              bệnh nhân làm trung tâm từ năm 2005.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Trang Chủ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Dịch Vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Bác Sĩ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Đặt Lịch Hẹn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Cổng Bệnh Nhân
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Liên Hệ
                </a>
              </li>
            </ul>
          </div>
          {/* Departments */}
          <div>
            <h3 className="text-xl font-bold mb-4">Khoa Phòng</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Nội Khoa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Nhi Khoa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Tim Mạch
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Tai Mũi Họng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Thần Kinh
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Chỉnh Hình
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Thông Tin Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Đại lộ Y tế, Quận Y, Thành phố, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>contact@healthclinic.com</span>
              </li>
              <li className="flex items-start">
                <Clock size={20} className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p>Thứ Hai - Thứ Sáu: 8:00 - 20:00</p>
                  <p>Thứ Bảy: 8:00 - 14:00</p>
                  <p>Chủ Nhật: Đóng cửa</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Phòng Khám Sức Khỏe. Tất cả các
            quyền được bảo lưu.
          </p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mx-2">
              Chính Sách Bảo Mật
            </a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">
              Điều Khoản Dịch Vụ
            </a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">
              Chính Sách Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
