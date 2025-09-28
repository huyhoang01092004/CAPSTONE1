import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CheckCircle,
  Calendar,
  Star,
  Phone,
  Mail,
  MapPin,
  Heart,
  Brain,
  Stethoscope,
  Ear,
  Baby,
  Bone,
} from "lucide-react";

// Map icon cho từng khoa
const iconMap = {
  "Tim Mạch": <Heart className="h-16 w-16 text-green-500" />,
  "Thần Kinh": <Brain className="h-16 w-16 text-green-500" />,
  "Nội Khoa": <Stethoscope className="h-16 w-16 text-green-500" />,
  "Tai Mũi Họng": <Ear className="h-16 w-16 text-green-500" />,
  "Nhi Khoa": <Baby className="h-16 w-16 text-green-500" />,
  "Chỉnh Hình": <Bone className="h-16 w-16 text-green-500" />,
};

const DepartmentDetails = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/departments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        return res.json();
      })
      .then((data) => {
        const safeData = {
          id: data.department_id,
          ...data,
          services: data.services
            ? Array.isArray(data.services)
              ? data.services
              : (() => {
                  try {
                    return JSON.parse(data.services);
                  } catch {
                    return [];
                  }
                })()
            : [],
          equipments: data.equipments
            ? Array.isArray(data.equipments)
              ? data.equipments
              : (() => {
                  try {
                    return JSON.parse(data.equipments);
                  } catch {
                    return [];
                  }
                })()
            : [],
          doctors: Array.isArray(data.doctors)
            ? data.doctors.map((doc) => ({
                ...doc,
                id: doc.id || doc.doctor_id,
              }))
            : [],
        };

        setDepartment(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi load chi tiết:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  if (!department) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Không tìm thấy thông tin khoa
        </h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-green-600 mb-6">
          <ArrowLeft size={20} className="mr-2" /> Quay lại trang chủ
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-green-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-4 md:mb-0 md:mr-6">
                {iconMap[department.name] || (
                  <User className="h-16 w-16 text-green-500" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Khoa {department.name || "Chưa có tên"}
                </h1>
                <p className="text-green-100 mb-4 max-w-3xl">
                  {department.description || "Chưa có mô tả"}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center">
                    <User size={18} className="mr-2" />{" "}
                    {department.doctorCount || 0} bác sĩ
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center">
                    <Calendar size={18} className="mr-2" /> Thành lập năm{" "}
                    {department.established_year || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="md:col-span-2">
            {/* Services */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                Dịch Vụ Y Tế
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.services.length > 0 ? (
                  department.services.map((s, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="text-green-600 mr-2 mt-1"
                      />
                      <span>{s}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có dịch vụ nào</p>
                )}
              </div>
            </div>

            {/* Equipments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                Trang Thiết Bị
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.equipments.length > 0 ? (
                  department.equipments.map((e, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="text-green-600 mr-2 mt-1"
                      />
                      <span>{e}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có thiết bị nào</p>
                )}
              </div>
            </div>

            {/* Doctors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Đội Ngũ Bác Sĩ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {department.doctors.length > 0 ? (
                  department.doctors.map((doctor) => {
                    let specialty = "Chưa rõ chuyên khoa";
                    try {
                      if (doctor.specialty) {
                        const parsed =
                          typeof doctor.specialty === "string"
                            ? JSON.parse(doctor.specialty)
                            : doctor.specialty;
                        specialty = Array.isArray(parsed)
                          ? parsed[0]
                          : doctor.specialty;
                      }
                    } catch {
                      specialty = doctor.specialty || "Chưa rõ chuyên khoa";
                    }

                    return (
                      <div
                        key={doctor.id}
                        className="flex items-center bg-gray-50 rounded-lg p-4"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          <img
                            src={
                              doctor.image ||
                              "https://via.placeholder.com/80?text=Doctor"
                            }
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">{doctor.name}</h3>
                          <p className="text-green-600 text-sm mb-1">
                            {specialty}
                          </p>
                          <div className="flex items-center text-yellow-400 mb-1">
                            <Star size={14} fill="currentColor" />
                            <span className="ml-1 text-sm">
                              {doctor.rating || "N/A"}
                            </span>
                          </div>
                          <Link
                            to={`/doctor/${doctor.id}`}
                            className="text-green-600 text-sm hover:underline"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 italic">Chưa có bác sĩ nào</p>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Thông Tin Khoa
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>Trưởng khoa:</strong>{" "}
                  {department.head_doctor || "Chưa có thông tin"}
                </p>
                <p>
                  <strong>Số lượng bác sĩ:</strong>{" "}
                  {department.doctorCount || 0} bác sĩ
                </p>
                <p>
                  <strong>Năm thành lập:</strong>{" "}
                  {department.established_year || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Thông Tin Liên Hệ
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone size={18} className="text-green-600 mr-3" />
                  <span>{department.phone || "Chưa có số điện thoại"}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="text-green-600 mr-3" />
                  <span>{department.email || "Chưa có email"}</span>
                </div>
                <div className="flex items-start">
                  <MapPin size={18} className="text-green-600 mr-3 mt-1" />
                  <span>{department.address || "Chưa có địa chỉ"}</span>
                </div>
              </div>
            </div>

            <Link
              to="/booking"
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 block text-center"
            >
              Đặt Lịch Hẹn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
