import React, { useEffect, useState } from "react";
import { Heart, Brain, Stethoscope, Ear, Baby, Bone } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  "Tim Mạch": <Heart className="h-12 w-12 text-green-600" />,
  "Thần Kinh": <Brain className="h-12 w-12 text-green-600" />,
  "Nội Khoa": <Stethoscope className="h-12 w-12 text-green-600" />,
  "Tai Mũi Họng": <Ear className="h-12 w-12 text-green-600" />,
  "Nhi Khoa": <Baby className="h-12 w-12 text-green-600" />,
  "Chỉnh Hình": <Bone className="h-12 w-12 text-green-600" />,
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Lỗi load departments:", err));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Khoa Phòng Y Tế</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp nhiều dịch vụ y tế chuyên biệt để đáp ứng mọi nhu
            cầu chăm sóc sức khỏe của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div
              key={dept.department_id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{iconMap[dept.name]}</div>
              <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
              <div className="text-green-600 text-sm font-medium mb-3">
                {dept.doctorCount || 0} bác sĩ chuyên khoa
              </div>
              <p className="text-gray-600 mb-4">{dept.description}</p>
              <Link
                to={`/department/${dept.department_id}`}
                className="text-green-600 font-medium hover:text-green-700 inline-flex items-center"
              >
                Tìm Hiểu Thêm
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;
