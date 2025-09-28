import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/doctors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu bác sĩ");
        return res.json();
      })
      .then((data) => {
        const safeData = {
          id: data.doctor_id,
          name: data.name,
          bio: data.bio || "Chưa có mô tả",
          department: data.department_name || "Chưa rõ",
          image:
            data.avatar_url ||
            "https://via.placeholder.com/400x300?text=Doctor",
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          education: parseSafeArray(data.education),
          experience: parseSafeArray(data.experience),
          specializations: parseSafeArray(data.specialties),
          publications: parseSafeArray(data.research),
          languages: parseSafeArray(data.languages),
          contact: {
            phone: data.phone || "Chưa có số điện thoại",
            email: data.email || "Chưa có email",
            office: data.office_room || "Chưa có phòng khám",
          },
        };
        setDoctor(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi load bác sĩ:", err);
        setLoading(false);
      });
  }, [id]);

  const parseSafeArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  if (loading)
    return <p className="text-center py-10">Đang tải thông tin bác sĩ...</p>;

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Không tìm thấy thông tin bác sĩ
        </h2>
        <Link to="/" className="text-green-600 hover:underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-green-600 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Quay lại trang chủ
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 md:mb-0 md:mr-6">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {doctor.name}
                </h1>
                <p className="text-green-100 text-lg mb-3">
                  {doctor.department}
                </p>
                <div className="flex items-center mb-4">
                  <Star size={18} fill="gold" className="mr-1" />
                  <span>
                    {doctor.rating} ({doctor.reviewCount} đánh giá)
                  </span>
                </div>
                <p className="text-white italic">{doctor.bio}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left */}
            <div className="md:col-span-2">
              {/* Education & Experience */}
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Thông Tin Chuyên Môn
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-2 flex items-center">
                      <BookOpen size={18} className="text-green-600 mr-2" />
                      Học Vấn
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      {doctor.education.length > 0 ? (
                        doctor.education.map((e, i) => <li key={i}>• {e}</li>)
                      ) : (
                        <li>Chưa có thông tin</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 flex items-center">
                      <Award size={18} className="text-green-600 mr-2" />
                      Kinh Nghiệm
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      {doctor.experience.length > 0 ? (
                        doctor.experience.map((e, i) => <li key={i}>• {e}</li>)
                      ) : (
                        <li>Chưa có thông tin</li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Specializations */}
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Chuyên Ngành
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.length > 0 ? (
                    doctor.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có chuyên ngành</p>
                  )}
                </div>
              </section>

              {/* Publications */}
              <section>
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Công Trình Nghiên Cứu
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {doctor.publications.length > 0 ? (
                    doctor.publications.map((p, i) => (
                      <li key={i}>
                        {i + 1}. {p}
                      </li>
                    ))
                  ) : (
                    <li>Chưa có công trình nghiên cứu</li>
                  )}
                </ul>
              </section>
            </div>

            {/* Right */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                <h3 className="font-bold mb-4 border-b pb-2">Lịch Khám</h3>
                <p>Ngày: Thứ Hai - Thứ Sáu</p>
                <p>Giờ: 08:00 - 17:00</p>
                <p className="text-sm text-gray-500 italic">
                  * Có thể thay đổi theo lịch trực
                </p>
                <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  <Calendar size={18} className="inline mr-2" />
                  Đặt Lịch Hẹn
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                <h3 className="font-bold mb-4 border-b pb-2">
                  Thông Tin Liên Hệ
                </h3>
                <p>
                  <Phone size={16} className="inline text-green-600 mr-2" />
                  {doctor.contact.phone}
                </p>
                <p>
                  <Mail size={16} className="inline text-green-600 mr-2" />
                  {doctor.contact.email}
                </p>
                <p>
                  <MapPin size={16} className="inline text-green-600 mr-2" />
                  {doctor.contact.office}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-4 border-b pb-2">Ngôn Ngữ</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.length > 0 ? (
                    doctor.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có ngôn ngữ</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
