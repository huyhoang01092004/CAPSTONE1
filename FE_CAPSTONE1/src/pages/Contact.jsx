import React, { useState, lazy } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    // Reset submission status after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-green-600 text-white p-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="text-lg text-green-100">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn với mọi thắc mắc
                và nhu cầu
              </p>
            </div>
          </div>
        </div>
        {/* Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                Thông Tin Liên Hệ
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Địa Chỉ</p>
                    <p className="text-gray-600">
                      123 Đại lộ Y tế, Quận Y, Thành phố, 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Điện Thoại</p>
                    <p className="text-gray-600">(024) 1234-5678</p>
                    <p className="text-gray-600">Hotline: 1900-1234</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-600">contact@healthclinic.com</p>
                    <p className="text-gray-600">support@healthclinic.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Giờ Làm Việc</p>
                    <p className="text-gray-600">
                      Thứ Hai - Thứ Sáu: 8:00 - 20:00
                    </p>
                    <p className="text-gray-600">Thứ Bảy: 8:00 - 14:00</p>
                    <p className="text-gray-600">Chủ Nhật: Đóng cửa</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                Kết Nối Với Chúng Tôi
              </h2>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition duration-300"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition duration-300"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition duration-300"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
                  <p className="font-medium">Cảm ơn bạn đã liên hệ!</p>
                  <p>
                    Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong
                    thời gian sớm nhất.
                  </p>
                </div>
              ) : null}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Chủ Đề *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tin Nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-300 flex items-center"
                >
                  <Send size={18} className="mr-2" />
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
            Vị Trí Của Chúng Tôi
          </h2>
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0951822985844!2d105.84772007557894!3d21.02777628061301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1699297482075!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Phòng Khám Sức Khỏe location map"
            ></iframe>
          </div>
        </div>
        {/* Departments Contact */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
            Liên Hệ Theo Khoa Phòng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Khoa Tim Mạch</h3>
              <p className="text-gray-600 mb-2">
                Điện thoại: (024) 1234-5678 (Ext. 101)
              </p>
              <p className="text-gray-600">
                Email: cardiology@healthclinic.com
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Khoa Thần Kinh</h3>
              <p className="text-gray-600 mb-2">
                Điện thoại: (024) 1234-5678 (Ext. 102)
              </p>
              <p className="text-gray-600">Email: neurology@healthclinic.com</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Khoa Nội</h3>
              <p className="text-gray-600 mb-2">
                Điện thoại: (024) 1234-5678 (Ext. 103)
              </p>
              <p className="text-gray-600">Email: internal@healthclinic.com</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                Khoa Tai Mũi Họng
              </h3>
              <p className="text-gray-600 mb-2">
                Điện thoại: (024) 1234-5678 (Ext. 104)
              </p>
              <p className="text-gray-600">Email: ent@healthclinic.com</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Khoa Nhi</h3>
              <p className="text-gray-600 mb-2">
                Điện thoại: (024) 1234-5678 (Ext. 105)
              </p>
              <p className="text-gray-600">
                Email: pediatrics@healthclinic.com
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Khoa Chỉnh Hình</h3>
              <p className="text-gray-600 mb-2">
                Điện thoại: (024) 1234-5678 (Ext. 106)
              </p>
              <p className="text-gray-600">
                Email: orthopedics@healthclinic.com
              </p>
            </div>
          </div>
        </div>
        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Làm thế nào để đặt lịch hẹn?
              </h3>
              <p className="text-gray-600">
                Bạn có thể đặt lịch hẹn qua trang web của chúng tôi, gọi điện
                đến số (024) 1234-5678, hoặc đến trực tiếp phòng khám trong giờ
                làm việc.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Phòng khám có chấp nhận bảo hiểm y tế không?
              </h3>
              <p className="text-gray-600">
                Có, chúng tôi chấp nhận hầu hết các loại bảo hiểm y tế. Vui lòng
                liên hệ với chúng tôi để biết thêm chi tiết về bảo hiểm cụ thể
                của bạn.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Tôi cần mang theo những gì khi đến khám?
              </h3>
              <p className="text-gray-600">
                Bạn nên mang theo thẻ bảo hiểm y tế, giấy tờ tùy thân, kết quả
                xét nghiệm hoặc chẩn đoán trước đây (nếu có), và danh sách thuốc
                đang sử dụng.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Làm thế nào để tôi có thể hủy hoặc đổi lịch hẹn?
              </h3>
              <p className="text-gray-600">
                Bạn có thể hủy hoặc đổi lịch hẹn bằng cách gọi điện đến số (024)
                1234-5678 ít nhất 24 giờ trước thời gian hẹn đã đặt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
