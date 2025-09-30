import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Loader2,
  LogIn,
  CheckCircle2,
} from "lucide-react";

const QuickBooking = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ user & token từ localStorage/sessionStorage
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  // 📌 Lấy danh sách khoa
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error("❌ Lỗi lấy khoa:", error);
      }
    };
    fetchDepartments();
  }, []);

  // 📌 Lấy danh sách bác sĩ theo khoa
  useEffect(() => {
    if (!department) {
      setDoctors([]);
      return;
    }
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/doctors?department_id=${department}`
        );
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("❌ Lỗi lấy bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, [department]);

  // 📌 Lấy slot khả dụng
  useEffect(() => {
    if (!doctor || !date) {
      setAvailableTimeSlots([]);
      return;
    }
    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/doctors/${doctor}/slots?date=${date}`
        );
        const data = await res.json();
        setAvailableTimeSlots(data.available_slots || []);
      } catch (error) {
        console.error("❌ Lỗi lấy slots:", error);
      }
    };
    fetchSlots();
  }, [doctor, date]);

  // 📌 Format về MySQL DATETIME
  const formatDateTime = (dateStr, timeStr) => {
    return `${dateStr} ${timeStr}:00`;
  };

  // 📌 Đặt lịch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user || !token) {
      setErrorMsg("⚠️ Bạn cần đăng nhập trước khi đặt lịch!");
      return;
    }
    if (!department || !doctor || !date || !timeSlot) {
      setErrorMsg("⚠️ Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: user.patient_id,
          doctor_id: doctor,
          department_id: department,
          scheduled_start: formatDateTime(date, timeSlot.start),
          scheduled_end: formatDateTime(date, timeSlot.end),
          status: "pending",
          reason: "Đặt lịch nhanh qua hệ thống",
          booking_channel: "web",
          created_by_user_id: user.id,
          cancellation_reason: null,
          note: null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("✅ Đặt lịch thành công!");

        // 🔄 load lại slot mới
        const resSlots = await fetch(
          `http://localhost:5000/api/doctors/${doctor}/slots?date=${date}`
        );
        const newSlots = await resSlots.json();
        setAvailableTimeSlots(newSlots.available_slots || []);
        setTimeSlot(null);
      } else {
        setErrorMsg(data.message || "❌ Không thể đặt lịch");
      }
    } catch (error) {
      console.error("❌ Lỗi đặt lịch:", error);
      setErrorMsg("❌ Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6 flex justify-between">
            <div>
              <h2 className="text-2xl font-bold">Đặt Lịch Hẹn Nhanh</h2>
              <p className="mt-2">Điền vào biểu mẫu dưới đây để đặt lịch hẹn</p>
            </div>
            {user ? (
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span>{user.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-300">
                <LogIn size={20} />
                <span>Chưa đăng nhập</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Chọn Khoa
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Chọn Khoa</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Chọn Bác Sĩ
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  required
                  disabled={!department}
                >
                  <option value="">Chọn Bác Sĩ</option>
                  {doctors.map((doc) => (
                    <option key={doc.doctor_id} value={doc.doctor_id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Ngày Ưu Tiên
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-md"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* TimeSlot */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Chọn Giờ Khám
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={timeSlot ? timeSlot.start : ""}
                  onChange={(e) => {
                    const selected = availableTimeSlots.find(
                      (s) => s.start === e.target.value
                    );
                    setTimeSlot(selected || null);
                  }}
                  required
                  disabled={!doctor || !date}
                >
                  <option value="">Chọn Giờ Khám</option>
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot) => {
                      let isPast = false;
                      const todayStr = new Date().toISOString().split("T")[0];
                      if (date === todayStr) {
                        const now = new Date();
                        const nowMinutes =
                          now.getHours() * 60 + now.getMinutes();
                        const [h, m] = slot.start.split(":").map(Number);
                        const slotMinutes = h * 60 + m;
                        isPast = slotMinutes <= nowMinutes;
                      }
                      return (
                        <option
                          key={`${slot.start}-${slot.end}`}
                          value={slot.start}
                          disabled={isPast}
                        >
                          {slot.start} - {slot.end} {isPast ? "(Hết hạn)" : ""}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">Không còn slot trống</option>
                  )}
                </select>
              </div>
            </div>

            {/* Error / Success */}
            {errorMsg && (
              <p className="text-red-500 mt-4 text-center">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-green-600 mt-4 text-center flex items-center justify-center">
                <CheckCircle2 className="mr-2" /> {successMsg}
              </p>
            )}

            {/* Submit */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                className={`px-6 py-3 font-medium rounded-md transition duration-300 flex items-center justify-center mx-auto ${
                  !user || loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                disabled={!user || !timeSlot || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Đang đặt...
                  </>
                ) : (
                  "Đặt Lịch Hẹn"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t flex justify-around">
            <div className="flex items-center">
              <User className="text-green-600 mr-2" size={20} />
              <span>200+ Bác Sĩ</span>
            </div>
            <div className="flex items-center">
              <Calendar className="text-green-600 mr-2" size={20} />
              <span>Lịch Hẹn Trong Ngày</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-green-600 mr-2" size={20} />
              <span>Hỗ Trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickBooking;
