import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  X,
  AlertTriangle,
  RefreshCw,
  FileText,
  Search,
  Star,
  CheckCircle,
} from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Reschedule
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // ================== FETCH ==================
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!storedUser || !storedUser.id) return;
        const res = await fetch(
          `http://localhost:5000/api/appointments/by-user/${storedUser.id}`
        );
        const result = await res.json();

        if (result.success) {
          const mapped = result.data.map((app) => {
            const startDate = new Date(app.scheduled_start);
            return {
              id: app.appointment_id,
              doctorId: app.doctor_id,
              doctorName: app.doctor_name,
              doctorSpecialty: app.department_name,
              doctorImage:
                app.doctor_avatar ||
                "https://cdn-icons-png.flaticon.com/512/387/387561.png",
              date: startDate.toISOString().split("T")[0],
              time: startDate.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              scheduledDateTime: startDate,
              status: app.status,
              reason: app.reason || "Không có",
              notes: app.note,
            };
          });

          setAppointments(mapped);
          setFilteredAppointments(mapped);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  // ================== FILTER ==================
  const filterAppointments = (tab) => {
    setActiveTab(tab);
    let filtered = appointments;

    if (tab === "upcoming") {
      filtered = appointments.filter(
        (app) =>
          (app.status === "confirmed" ||
            app.status === "rescheduled" ||
            app.status === "pending") &&
          app.scheduledDateTime > new Date()
      );
    } else if (tab === "past") {
      filtered = appointments.filter(
        (app) =>
          app.status === "completed" || app.scheduledDateTime < new Date()
      );
    } else if (tab === "cancelled") {
      filtered = appointments.filter((app) => app.status === "cancelled");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.doctorSpecialty
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  // ================== SEARCH ==================
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterAppointments(activeTab);
  };

  // ================== CANCEL ==================
  const handleCancel = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );
      const result = await res.json();

      if (result.success) {
        const updated = appointments.map((app) =>
          app.id === id ? { ...app, status: "cancelled" } : app
        );
        setAppointments(updated);
        filterAppointments(activeTab);
        setSuccessMessage("✅ Hủy lịch thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("❌ Lỗi hủy lịch:", err);
    }
  };

  // ================== RESCHEDULE ==================
  const handleReschedule = async (id, date, time) => {
    if (!date || !time) return;
    const scheduled_start = new Date(`${date}T${time}:00`);

    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${id}/reschedule`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduled_start }),
        }
      );
      const result = await res.json();

      if (result.success) {
        const updated = appointments.map((app) =>
          app.id === id
            ? {
                ...app,
                scheduledDateTime: scheduled_start,
                date,
                time,
                status: "rescheduled",
              }
            : app
        );
        setAppointments(updated);
        filterAppointments(activeTab);
        setSuccessMessage("✅ Đổi lịch thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("❌ Lỗi đổi lịch:", err);
    }
  };

  // ================== FORMAT ==================
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return { text: "Đã xác nhận", color: "bg-green-100 text-green-800" };
      case "completed":
        return { text: "Đã hoàn thành", color: "bg-blue-100 text-blue-800" };
      case "cancelled":
        return { text: "Đã hủy", color: "bg-red-100 text-red-800" };
      case "rescheduled":
        return { text: "Đã đổi lịch", color: "bg-yellow-100 text-yellow-800" };
      case "pending":
        return { text: "Chờ xác nhận", color: "bg-gray-100 text-gray-800" };
      default:
        return { text: "Không xác định", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Link to="/" className="flex items-center text-green-600 mb-2">
              <ArrowLeft size={20} className="mr-2" />
              Quay lại trang chủ
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Quản Lý Lịch Hẹn
            </h1>
          </div>
          <Link
            to="/booking"
            className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center"
          >
            <Calendar className="mr-2" size={18} />
            Đặt Lịch Hẹn Mới
          </Link>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md">
            <CheckCircle className="mr-2" size={18} />
            {successMessage}
          </div>
        )}

        {/* Filter + Search */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex mb-4 md:mb-0 space-x-1">
              {["all", "upcoming", "past", "cancelled"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === tab
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => filterAppointments(tab)}
                >
                  {tab === "all"
                    ? "Tất cả"
                    : tab === "upcoming"
                    ? "Sắp tới"
                    : tab === "past"
                    ? "Đã qua"
                    : "Đã hủy"}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm lịch hẹn..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Appointment Cards */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => {
              const { text: statusText, color: statusColor } = getStatusInfo(
                appointment.status
              );
              const isPastAppointment =
                appointment.scheduledDateTime < new Date();

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={appointment.doctorImage}
                          alt={appointment.doctorName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {appointment.doctorName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.doctorSpecialty}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-start mb-2">
                        <Calendar
                          size={18}
                          className="text-green-600 mr-2 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Ngày khám:</p>
                          <p className="font-medium">
                            {formatDate(appointment.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start mb-2">
                        <Clock
                          size={18}
                          className="text-green-600 mr-2 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Giờ khám:</p>
                          <p className="font-medium">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText
                          size={18}
                          className="text-green-600 mr-2 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Lý do khám:</p>
                          <p className="font-medium">{appointment.reason}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${statusColor}`}
                      >
                        {statusText}
                      </span>
                      {appointment.notes && (
                        <div className="relative group">
                          <button className="text-gray-500 hover:text-gray-700">
                            <AlertTriangle size={16} />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            {appointment.notes}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nút hành động */}
                    <div className="flex space-x-2">
                      {(appointment.status === "confirmed" ||
                        appointment.status === "rescheduled" ||
                        appointment.status === "pending") &&
                        !isPastAppointment && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedAppointmentId(appointment.id);
                                setShowRescheduleModal(true);
                              }}
                              className="flex-1 py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-300 flex items-center justify-center"
                            >
                              <RefreshCw size={16} className="mr-1" />
                              Đổi lịch
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAppointmentId(appointment.id);
                                setShowCancelModal(true);
                              }}
                              className="flex-1 py-2 px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition duration-300 flex items-center justify-center"
                            >
                              <X size={16} className="mr-1" />
                              Hủy lịch
                            </button>
                          </>
                        )}
                      {appointment.status === "completed" && (
                        <Link
                          to={`/doctor/${appointment.doctorId}`}
                          className="w-full py-2 px-4 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition duration-300 flex items-center justify-center"
                        >
                          <Star size={16} className="mr-1" />
                          Đánh giá bác sĩ
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Không có lịch hẹn nào
            </h3>
          </div>
        )}
      </div>

      {/* ===== Modal Hủy lịch ===== */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-2">Xác nhận hủy lịch</h2>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy lịch hẹn này không?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleCancel(selectedAppointmentId);
                  setShowCancelModal(false);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Đổi lịch ===== */}
      {showRescheduleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4">Đổi lịch hẹn</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày mới
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ mới
              </label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Đóng
              </button>
              <button
                disabled={!newDate || !newTime}
                onClick={() => {
                  handleReschedule(selectedAppointmentId, newDate, newTime);
                  setShowRescheduleModal(false);
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
