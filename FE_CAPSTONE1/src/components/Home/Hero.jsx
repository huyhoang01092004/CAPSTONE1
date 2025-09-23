import React from "react";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Sức Khỏe Của Bạn Là Ưu Tiên Của Chúng Tôi
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Trải nghiệm dịch vụ chăm sóc sức khỏe chất lượng với đội ngũ bác
              sĩ chuyên gia. Đặt lịch hẹn ngay hôm nay và thực hiện bước đầu
              tiên hướng tới sức khỏe tốt hơn.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/booking"
                className="px-6 py-3 bg-white text-green-600 font-medium rounded-md hover:bg-gray-100 transition duration-300"
              >
                Đặt Lịch Hẹn
              </Link>
              <Link
                to="/learn-more"
                className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-green-600 transition duration-300"
              >
                Tìm Hiểu Thêm
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Chuyên gia y tế"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
