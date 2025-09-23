import React, { useState } from "react";
import { MessageSquare, X, Send, Mic, Calendar, User } from "lucide-react";

const AIChat = ({ isOpen, setIsOpen }) => {
  const [selectedTime, setSelectedTime] = useState("");
  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

  return (
    <>
      {/* Chat button */}
      <button
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-600 hover:bg-green-700"
        } text-white transition-all duration-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-lg shadow-xl z-40 transition-all duration-300 transform ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        } overflow-hidden flex flex-col`}
        style={{ height: "500px" }}
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold">Trợ Lý AI</h3>
            <p className="text-sm text-green-100">Đặt Lịch Hẹn</p>
          </div>
          <button
            className="ml-auto text-white/80 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat messages (fake UI) */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
          <div className="bg-green-100 p-3 rounded-lg text-sm text-gray-800 w-fit">
            Xin chào! Tôi là trợ lý sức khỏe AI của bạn. Tôi có thể giúp gì cho
            bạn hôm nay?
          </div>
          <div className="bg-white p-3 rounded-lg text-sm text-gray-800 border w-fit ml-auto">
            Tôi bị ho kéo dài
          </div>

          {/* Appointment suggestion (fake) */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
            <h4 className="font-bold text-gray-800 mb-2">Lịch Hẹn Khả Dụng</h4>
            <p className="text-sm text-gray-600 mb-3">Khoa Nội Khoa</p>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn Ngày
              </label>
              <select className="w-full p-2 border rounded-md">
                <option>Ngày mai</option>
                <option>Trong 2 ngày</option>
                <option>Trong 3 ngày</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn Giờ
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    className={`p-2 text-sm border rounded-md ${
                      selectedTime === time
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
              <Calendar size={18} className="mr-2" />
              Đặt Lịch Hẹn
            </button>
          </div>
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Nhập triệu chứng của bạn..."
            />
            <button className="p-2 bg-gray-100 border-y border-r rounded-r-md hover:bg-gray-200">
              <Mic size={20} className="text-gray-500" />
            </button>
            <button className="ml-2 p-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
