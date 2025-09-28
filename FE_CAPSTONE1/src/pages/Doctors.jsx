import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search, Filter, User } from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // State tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Tất cả");
  const [selectedRating, setSelectedRating] = useState("Tất cả");

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi tải dữ liệu bác sĩ");
        return res.json();
      })
      .then((data) => {
        const safeData = data.map((doc) => ({
          id: doc.doctor_id,
          name: doc.name,
          department: doc.department_name || "Chưa rõ",
          experience: doc.experience ? `${doc.experience}` : "0",
          image:
            doc.avatar_url || "https://via.placeholder.com/400x300?text=Doctor",
          rating: parseFloat(doc.rating) || 0,
          reviewCount: doc.reviewCount || 0,
        }));
        setDoctors(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center py-10">Đang tải danh sách bác sĩ...</p>;
  }

  // Danh sách department để lọc
  const departments = [
    "Tất cả",
    ...new Set(doctors.map((doc) => doc.department)),
  ];

  // Danh sách filter rating (theo yêu cầu)
  const ratingOptions = ["Tất cả", "> 3", "> 4", "5"];

  // Lọc bác sĩ theo search, department và rating
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "Tất cả" ||
      doctor.department === selectedDepartment;
    const matchesRating =
      selectedRating === "Tất cả" ||
      (selectedRating === "> 3" && doctor.rating > 3) ||
      (selectedRating === "> 4" && doctor.rating > 4) ||
      (selectedRating === "=5" && doctor.rating === 5);

    return matchesSearch && matchesDepartment && matchesRating;
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search + Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ô search */}
            <div className="col-span-1 md:col-span-1.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ theo tên..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Dropdown department */}
            <div>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept === "Tất cả" ? "Tất cả khoa" : `Khoa ${dept}`}
                    </option>
                  ))}
                </select>
                <Filter
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Dropdown rating */}
            <div>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  {ratingOptions.map((rate, index) => (
                    <option key={index} value={rate}>
                      {rate === "Tất cả" ? "Tất cả đánh giá" : `⭐ ${rate}`}
                    </option>
                  ))}
                </select>
                <Star
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Không tìm thấy bác sĩ nào
              </h3>
              <p className="text-gray-600">Vui lòng thử lại với bộ lọc khác.</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                  <p className="text-green-600 mb-1">
                    Chuyên khoa: {doctor.department}
                  </p>
                  <div className="flex items-center mb-4">
                    <Star size={18} fill="gold" className="mr-1" />
                    <span className="text-gray-700 text-sm">
                      {doctor.rating}{" "}
                      <span className="text-gray-500">
                        ({doctor.reviewCount} đánh giá)
                      </span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/doctor/${doctor.id}`}
                      className="flex-1 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 text-center"
                    >
                      Xem Chi Tiết
                    </Link>
                    <Link
                      to="/booking"
                      className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                    >
                      Đặt Lịch Hẹn
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
