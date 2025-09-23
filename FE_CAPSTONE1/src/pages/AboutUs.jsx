import React from "react";
import {
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Users,
  Building,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-green-600 text-white p-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Giới Thiệu Về Phòng Khám Sức Khỏe
              </h1>
              <p className="text-lg text-green-100">
                Chăm sóc sức khỏe chất lượng cao với phương pháp lấy bệnh nhân
                làm trung tâm từ năm 2005
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Câu Chuyện Của Chúng Tôi
                </h2>
                <p className="text-gray-600 mb-4">
                  Phòng Khám Sức Khỏe được thành lập vào năm 2005 với sứ mệnh
                  mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, tiếp cận
                  được và toàn diện cho mọi người dân. Từ một phòng khám nhỏ với
                  vài chuyên khoa, chúng tôi đã phát triển thành một trung tâm y
                  tế đa khoa hiện đại với đội ngũ bác sĩ giàu kinh nghiệm và
                  trang thiết bị tiên tiến.
                </p>
                <p className="text-gray-600">
                  Qua hơn 18 năm hoạt động, chúng tôi đã phục vụ hơn 500,000
                  bệnh nhân và không ngừng cải tiến để đáp ứng nhu cầu chăm sóc
                  sức khỏe ngày càng cao của cộng đồng.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Phòng khám của chúng tôi"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Mission, Vision, Values */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Sứ Mệnh, Tầm Nhìn & Giá Trị
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Sứ Mệnh</h3>
              <p className="text-gray-600 text-center">
                Cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao, lấy bệnh nhân
                làm trung tâm, giúp mọi người đạt được sức khỏe tối ưu và nâng
                cao chất lượng cuộc sống.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Tầm Nhìn</h3>
              <p className="text-gray-600 text-center">
                Trở thành trung tâm y tế hàng đầu, được công nhận về sự xuất sắc
                trong chăm sóc bệnh nhân, đổi mới y khoa và đóng góp tích cực
                cho sức khỏe cộng đồng.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">
                Giá Trị Cốt Lõi
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle
                    size={18}
                    className="text-green-600 mr-2 mt-1 flex-shrink-0"
                  />
                  <span>Tôn trọng và lòng trắc ẩn</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={18}
                    className="text-green-600 mr-2 mt-1 flex-shrink-0"
                  />
                  <span>Chất lượng và an toàn</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={18}
                    className="text-green-600 mr-2 mt-1 flex-shrink-0"
                  />
                  <span>Đổi mới và cải tiến liên tục</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={18}
                    className="text-green-600 mr-2 mt-1 flex-shrink-0"
                  />
                  <span>Làm việc nhóm và hợp tác</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={18}
                    className="text-green-600 mr-2 mt-1 flex-shrink-0"
                  />
                  <span>Trách nhiệm và minh bạch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Facilities */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Cơ Sở Vật Chất</h2>
            <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
              Phòng Khám Sức Khỏe tự hào có cơ sở vật chất hiện đại và trang
              thiết bị y tế tiên tiến để đảm bảo dịch vụ chăm sóc tốt nhất cho
              bệnh nhân.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Phòng khám hiện đại"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">
                  Phòng Khám Hiện Đại
                </h3>
                <p className="text-gray-600 text-sm">
                  Các phòng khám được thiết kế thoải mái và trang bị đầy đủ để
                  đảm bảo trải nghiệm tốt nhất cho bệnh nhân.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1516549655619-8c224e5a2531?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Phòng phẫu thuật"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">
                  Phòng Phẫu Thuật
                </h3>
                <p className="text-gray-600 text-sm">
                  Phòng phẫu thuật vô trùng với trang thiết bị hiện đại đáp ứng
                  các tiêu chuẩn quốc tế về an toàn và hiệu quả.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Phòng xét nghiệm"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">
                  Phòng Xét Nghiệm
                </h3>
                <p className="text-gray-600 text-sm">
                  Phòng xét nghiệm được trang bị máy móc hiện đại, cung cấp kết
                  quả chính xác và nhanh chóng.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Phòng chụp X-quang"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">
                  Phòng Chẩn Đoán Hình Ảnh
                </h3>
                <p className="text-gray-600 text-sm">
                  Trang bị máy chụp X-quang, CT, MRI và siêu âm hiện đại để chẩn
                  đoán chính xác.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Phòng hồi sức"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">Phòng Hồi Sức</h3>
                <p className="text-gray-600 text-sm">
                  Phòng hồi sức với thiết bị theo dõi liên tục và đội ngũ y tá
                  chuyên nghiệp.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80"
                alt="Khu vực tiếp đón"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">
                  Khu Vực Tiếp Đón
                </h3>
                <p className="text-gray-600 text-sm">
                  Không gian tiếp đón thoải mái, thân thiện với đội ngũ nhân
                  viên nhiệt tình.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Thành Tựu & Chứng Nhận
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Giải Thưởng & Thành Tựu
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Award
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Phòng Khám Chất Lượng Cao 2022
                    </p>
                    <p className="text-gray-600 text-sm">Bộ Y Tế Việt Nam</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Giải Thưởng Dịch Vụ Y Tế Xuất Sắc 2021
                    </p>
                    <p className="text-gray-600 text-sm">
                      Hiệp Hội Y Tế Việt Nam
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Top 10 Phòng Khám Đa Khoa Hàng Đầu 2020
                    </p>
                    <p className="text-gray-600 text-sm">
                      Tạp Chí Y Học Việt Nam
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Giải Thưởng Đổi Mới Y Tế 2019
                    </p>
                    <p className="text-gray-600 text-sm">
                      Diễn Đàn Y Tế Đông Nam Á
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Chứng Nhận & Công Nhận
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Chứng Nhận ISO 9001:2015
                    </p>
                    <p className="text-gray-600 text-sm">
                      Hệ thống quản lý chất lượng
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Chứng Nhận JCI (Joint Commission International)
                    </p>
                    <p className="text-gray-600 text-sm">
                      Tiêu chuẩn quốc tế về an toàn và chất lượng
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Chứng Nhận Bệnh Viện An Toàn
                    </p>
                    <p className="text-gray-600 text-sm">Bộ Y Tế Việt Nam</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-green-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Thành Viên Hiệp Hội Bệnh Viện Châu Á
                    </p>
                    <p className="text-gray-600 text-sm">Từ năm 2015</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* CTA */}
        <div className="bg-green-600 rounded-lg shadow-md p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Đặt Lịch Khám Ngay Hôm Nay
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Đội ngũ y bác sĩ giàu kinh nghiệm của chúng tôi luôn sẵn sàng cung
            cấp dịch vụ chăm sóc sức khỏe tốt nhất cho bạn và gia đình.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/booking"
              className="px-6 py-3 bg-white text-green-600 font-medium rounded-md hover:bg-gray-100 transition duration-300"
            >
              Đặt Lịch Hẹn
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-green-700 transition duration-300"
            >
              Liên Hệ Với Chúng Tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
