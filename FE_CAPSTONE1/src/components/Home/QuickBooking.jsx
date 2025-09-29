import React, { useState } from "react";
import { Calendar, Clock, User } from "lucide-react";

const QuickBooking = () => {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu qua BE để xử lý
    console.log({ department, doctor, date, timeSlot });
    alert(
      `Yêu cầu đặt lịch hẹn với ${doctor} vào ngày ${date} lúc ${timeSlot} đã được gửi!`
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6">
            <h2 className="text-2xl font-bold">Đặt Lịch Hẹn Nhanh</h2>
            <p className="mt-2">
              Điền vào biểu mẫu dưới đây để đặt lịch hẹn của bạn
            </p>
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
                  {/* TODO: render từ BE */}
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
                  {/* TODO: render từ BE dựa vào department */}
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
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                  disabled={!doctor || !date}
                >
                  <option value="">Chọn Giờ Khám</option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-300"
                disabled={!timeSlot}
              >
                Đặt Lịch Hẹn
              </button>
            </div>
          </form>

          {/* Footer info */}
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
