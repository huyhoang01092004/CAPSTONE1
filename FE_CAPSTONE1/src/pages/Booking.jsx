import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Heart,
  Brain,
  Baby,
  Stethoscope,
  Eye,
  Ear,
  Star,
} from "lucide-react";

const Booking = () => {
  // ================== STATE ==================
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const [patientId, setPatientId] = useState(null); // 👈 thêm patientId
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [showDepartmentInfo, setShowDepartmentInfo] = useState(null);

  const [userId] = useState(8);

  // ================== API CALLS ==================
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("❌ Lỗi lấy departments:", err));
  }, []);

  useEffect(() => {
    if (department) {
      fetch(`http://localhost:5000/api/doctors?department_id=${department}`)
        .then((res) => res.json())
        .then((data) => setDoctors(data))
        .catch((err) => console.error("❌ Lỗi lấy doctors:", err));
    } else {
      setDoctors([]);
    }
  }, [department]);

  useEffect(() => {
    if (doctor && date) {
      fetch(`http://localhost:5000/api/doctors/${doctor}/slots?date=${date}`)
        .then((res) => res.json())
        .then((data) => setAvailableTimeSlots(data.available_slots || []))
        .catch((err) => console.error("❌ Lỗi lấy slots:", err));
    } else {
      setAvailableTimeSlots([]);
    }
  }, [doctor, date]);

  // ✅ lấy thông tin bệnh nhân từ userId
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/patients/by-user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const p = data.data;
            setPatientId(p.patient_id); // 👈 cần cho submit
            setPatientName(p.full_name || "");
            setPatientPhone(p.phone || "");
            setPatientEmail(p.email || "");
            setPatientGender(p.gender || "");
            setPatientAge(
              p.dob
                ? new Date().getFullYear() - new Date(p.dob).getFullYear()
                : ""
            );
          }
        })
        .catch((err) => console.error("❌ Lỗi lấy patient:", err));
    }
  }, [userId]);

  // ================== HANDLERS ==================
  const toggleDepartmentInfo = (id) => {
    setShowDepartmentInfo(showDepartmentInfo === id ? null : id);
  };

  const nextStep = () => {
    if (step === 1 && !department) return alert("Vui lòng chọn khoa");
    if (step === 2 && !doctor) return alert("Vui lòng chọn bác sĩ");
    if (step === 3 && (!date || !timeSlot))
      return alert("Vui lòng chọn ngày và giờ");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 30))
    .toISOString()
    .split("T")[0];

  // ✅ fix handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const [start, end] = timeSlot.split("-");
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId, // 👈 dùng patientId thay vì name/phone/email
          doctor_id: doctor,
          department_id: department,
          scheduled_start: `${date} ${start}:00`,
          scheduled_end: `${date} ${end}:00`,
          reason: reasonForVisit,
          booking_channel: "web",
          status: "pending",
          created_by_user_id: userId,
          note: null,
        }),
      });
      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const errData = await res.json();
        alert(`❌ Đặt lịch thất bại: ${errData.message || "Có lỗi xảy ra"}`);
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get department icon
  const getDepartmentIcon = (deptName) => {
    const name = deptName.toLowerCase();
    if (name.includes("tim") || name.includes("mạch"))
      return <Heart size={20} className="text-red-500" />;
    if (name.includes("nội"))
      return <Stethoscope size={20} className="text-blue-500" />;
    if (name.includes("nhi"))
      return <Baby size={20} className="text-pink-500" />;
    if (name.includes("thần"))
      return <Brain size={20} className="text-purple-500" />;
    if (name.includes("mắt"))
      return <Eye size={20} className="text-cyan-500" />;
    if (name.includes("tai"))
      return <Ear size={20} className="text-orange-500" />;
    return <Stethoscope size={20} className="text-green-500" />;
  };

  const selectedDoctor = doctor
    ? doctors.find((d) => String(d.doctor_id) === String(doctor))
    : null;

  // ================== RENDER ==================
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-green-600 mb-4 hover:text-green-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại trang chủ
          </Link>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Đặt Lịch Khám Bệnh
              </h1>
              <p className="text-green-100">
                Hoàn thành biểu mẫu dưới đây để đặt lịch hẹn với bác sĩ chuyên
                khoa của chúng tôi
              </p>
            </div>
          </div>
        </div>

        {/* Success */}
        {bookingSuccess && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Đặt Lịch Thành Công!
            </h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt lịch với {selectedDoctor?.name} vào {date} -{" "}
              {timeSlot}.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Đặt Lịch Mới
            </button>
          </div>
        )}

        {/* Form */}
        {!bookingSuccess && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Steps */}
            <div className="bg-gray-50 p-6 border-b">
              <div className="flex justify-between items-center relative max-w-3xl mx-auto">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
                {["Chọn Khoa", "Chọn Bác Sĩ", "Chọn Lịch", "Thông Tin"].map(
                  (label, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center relative z-10 ${
                        step >= i + 1 ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all ${
                          step >= i + 1
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-white border-2 border-gray-300 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs md:text-sm mt-2 font-medium whitespace-nowrap">
                        {label}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2 className="font-bold text-xl md:text-2xl mb-2">
                    Chọn Khoa Khám Bệnh
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng chọn khoa phù hợp với nhu cầu khám bệnh của bạn
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.department_id}>
                        <input
                          type="radio"
                          id={`dept-${dept.department_id}`}
                          name="department"
                          value={dept.department_id}
                          checked={department === String(dept.department_id)}
                          onChange={() =>
                            setDepartment(String(dept.department_id))
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor={`dept-${dept.department_id}`}
                          className={`flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            department === String(dept.department_id)
                              ? "border-green-600 bg-green-50 shadow-sm"
                              : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getDepartmentIcon(dept.name)}
                            <span className="font-medium text-gray-800">
                              {dept.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDepartmentInfo(dept.department_id);
                            }}
                            className="text-gray-500 hover:text-green-600 transition-colors"
                          >
                            {showDepartmentInfo === dept.department_id ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </label>
                        {showDepartmentInfo === dept.department_id && (
                          <div className="mt-2 p-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
                            {dept.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2 className="font-bold text-xl md:text-2xl mb-2">
                    Chọn Bác Sĩ
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng chọn bác sĩ bạn muốn khám tại Khoa{" "}
                    {
                      departments.find(
                        (d) => String(d.department_id) === department
                      )?.name
                    }
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <div key={doc.doctor_id} className="relative">
                        <input
                          type="radio"
                          id={`doc-${doc.doctor_id}`}
                          name="doctor"
                          value={doc.doctor_id}
                          checked={doctor === String(doc.doctor_id)}
                          onChange={() => setDoctor(String(doc.doctor_id))}
                          className="hidden"
                        />
                        <label
                          htmlFor={`doc-${doc.doctor_id}`}
                          className={`flex p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            doctor === String(doc.doctor_id)
                              ? "border-green-600 bg-green-50 shadow-sm"
                              : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                          }`}
                        >
                          <img
                            src={
                              doc.avatar_url || "https://via.placeholder.com/64"
                            }
                            alt={doc.name}
                            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {doc.name}
                            </h3>
                            <p className="text-sm text-green-600 mb-1">
                              {doc.department_name}
                            </p>

                            {/* ⭐ Rating */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={`${
                                      i < Math.floor(doc.rating || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {doc.rating || "5.0"} ({doc.reviewCount || "0"})
                              </span>
                            </div>

                            {/* 👇 Link xem chi tiết */}
                            <Link
                              to={`/doctor/${doc.doctor_id}`}
                              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h2 className="font-bold text-xl md:text-2xl mb-2">
                    Chọn Ngày và Giờ Khám
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng chọn ngày và giờ phù hợp để khám với{" "}
                    {selectedDoctor?.name}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn Ngày <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={18}
                        />
                        <input
                          type="date"
                          min={today}
                          max={maxDate}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full border-2 border-gray-300 px-10 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn Giờ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={18}
                        />
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full border-2 border-gray-300 px-10 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white"
                        >
                          <option value="">Chọn giờ</option>
                          {availableTimeSlots.map((slot, idx) => (
                            <option
                              key={idx}
                              value={`${slot.start}-${slot.end}`}
                            >
                              {slot.start} - {slot.end}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {date && timeSlot && selectedDoctor && (
                    <div className="p-5 bg-green-50 rounded-lg border-2 border-green-200">
                      <h3 className="font-semibold text-green-800 mb-3 text-lg">
                        Thông tin lịch hẹn:
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-700">
                          <User size={18} className="mr-3 text-green-600" />
                          <span>
                            <strong>Bác sĩ:</strong> {selectedDoctor.name}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar size={18} className="mr-3 text-green-600" />
                          <span>
                            <strong>Ngày:</strong>{" "}
                            {new Date(date).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock size={18} className="mr-3 text-green-600" />
                          <span>
                            <strong>Giờ:</strong> {timeSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div>
                  <h2 className="font-bold text-xl md:text-2xl mb-2">
                    Thông Tin Bệnh Nhân
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng cung cấp thông tin chính xác để chúng tôi có thể
                    phục vụ bạn tốt nhất
                  </p>

                  {/* Thông tin cá nhân */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                      Thông tin cá nhân
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={18}
                          />
                          <input
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full border-2 border-gray-300 px-10 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={18}
                          />
                          <input
                            type="tel"
                            placeholder="0912 345 678"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className="w-full border-2 border-gray-300 px-10 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={18}
                          />
                          <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full border-2 border-gray-300 px-10 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tuổi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="25"
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            className="w-full border-2 border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            min="0"
                            max="150"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={patientGender}
                            onChange={(e) => setPatientGender(e.target.value)}
                            className="w-full border-2 border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          >
                            <option value="">Chọn</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin y tế */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                      Thông tin y tế
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lý do khám <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText
                          className="absolute left-3 top-3 text-gray-400 pointer-events-none"
                          size={18}
                        />
                        <textarea
                          placeholder="Mô tả ngắn gọn về lý do bạn muốn gặp bác sĩ"
                          value={reasonForVisit}
                          onChange={(e) => setReasonForVisit(e.target.value)}
                          className="w-full border-2 border-gray-300 px-10 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Triệu chứng */}
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                      Triệu chứng
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        "Đau đầu",
                        "Sốt",
                        "Ho",
                        "Đau bụng",
                        "Chóng mặt",
                        "Buồn nôn",
                        "Mệt mỏi",
                        "Xem thêm...",
                      ].map((symptom) => (
                        <button
                          key={symptom}
                          type="button"
                          className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm hover:bg-green-50 hover:border-green-500 transition-all font-medium text-gray-700"
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Triệu chứng phổ biến
                    </p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Quay lại
                  </button>
                ) : (
                  <div></div>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Footer Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <Phone className="text-green-600 mr-3" size={24} />
              <h3 className="font-semibold text-lg">Cần hỗ trợ?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Nếu bạn gặp khó khăn trong quá trình đặt lịch hoặc có câu hỏi, hãy
              gọi cho chúng tôi
            </p>
            <p className="text-green-600 font-bold text-lg">(024) 1234-5678</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <Clock className="text-green-600 mr-3" size={24} />
              <h3 className="font-semibold text-lg">Giờ làm việc</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Thứ Hai - Thứ Sáu:{" "}
                <span className="float-right font-medium">8:00 - 20:00</span>
              </p>
              <p>
                Thứ Bảy:{" "}
                <span className="float-right font-medium">8:00 - 16:00</span>
              </p>
              <p>
                Chủ Nhật:{" "}
                <span className="float-right font-medium">8:00 - 12:00</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <h3 className="font-semibold text-lg">Lưu ý</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                • Vui lòng đến trước giờ hẹn 15-20 phút để hoàn tất thủ tục
              </li>
              <li>• Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có)</li>
              <li>• Bạn có thể hủy hoặc đổi lịch hẹn trước 24 giờ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
