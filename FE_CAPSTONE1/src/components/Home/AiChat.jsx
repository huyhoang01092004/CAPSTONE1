import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, X, Send, Loader2, AlertCircle, Calendar, 
  CheckCircle, Clock, MapPin, User as UserIcon, Activity 
} from "lucide-react";
import { analyzeSymptoms, healthCheck, getAvailableSlots, createAppointment } from "../../utils/aiService";
import { useNavigate } from "react-router-dom";

const AIChat = ({ isOpen, setIsOpen }) => {
  // States
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiServiceStatus, setAiServiceStatus] = useState("checking");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [user, setUser] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user from storage
  useEffect(() => {
    const storedUser = 
      JSON.parse(localStorage.getItem("user")) || 
      JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Check AI Service health when opened
  useEffect(() => {
    if (isOpen) {
      checkAIService();
      // Add welcome message if no messages
      if (messages.length === 0) {
        addBotMessage(
          "👋 **Xin chào! Tôi là Trợ Lý Sức Khỏe AI**\n\n" +
          "Tôi có thể giúp bạn:\n\n" +
          "🔍 Phân tích triệu chứng và chẩn đoán sơ bộ\n" +
          "🏥 Gợi ý khoa khám phù hợp\n" +
          "⚠️ Đánh giá mức độ khẩn cấp\n" +
          "📅 Tìm lịch hẹn trống và đặt lịch ngay\n" +
          "👨‍⚕️ Chọn bác sĩ phù hợp với bạn\n\n" +
          "Hãy mô tả triệu chứng của bạn để tôi hỗ trợ! 💬"
        );
      }
    }
  }, [isOpen]);

  // Check AI Service status
  const checkAIService = async () => {
    try {
      setAiServiceStatus("checking");
      await healthCheck();
      setAiServiceStatus("online");
    } catch (error) {
      setAiServiceStatus("offline");
      console.error("AI Service offline:", error);
    }
  };

  // Add message to chat
  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: "user", text, timestamp: new Date() }]);
  };

  const addBotMessage = (text, data = null) => {
    setMessages(prev => [...prev, { 
      type: "bot", 
      text, 
      data,
      timestamp: new Date() 
    }]);
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const symptomText = inputText.trim();
    setInputText("");
    addUserMessage(symptomText);

    // Check login
    if (!user) {
      addBotMessage(
        "⚠️ Bạn cần đăng nhập để sử dụng dịch vụ này. Vui lòng đăng nhập trước!"
      );
      setTimeout(() => {
        setIsOpen(false);
        navigate("/login");
      }, 2000);
      return;
    }

    // Check AI Service
    if (aiServiceStatus === "offline") {
      addBotMessage(
        "❌ Xin lỗi, AI Service hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ quản trị viên."
      );
      return;
    }

    setIsLoading(true);
    addBotMessage("🔍 Đang phân tích triệu chứng của bạn...");

    try {
      // Call AI Service
      console.log("🔵 Calling AI Service with:", symptomText);
      const response = await analyzeSymptoms({
        symptom_text: symptomText,
        request_appointment: false,
      });
      
      console.log("🔵 AI Response received:", response);

      if (response.success) {
        const data = response.data;
        setAnalysisResult(data);
        
        console.log("🔵 Analysis data:", data.analysis);
        console.log("🔵 Suggested departments:", data.analysis?.suggested_departments);

        // Build response message
        let message = "📊 **KẾT QUẢ PHÂN TÍCH**\n\n";

        // Matched symptoms
        if (data.analysis?.matched_symptoms?.length > 0) {
          message += "🔸 **Triệu chứng phát hiện:**\n";
          data.analysis.matched_symptoms.slice(0, 3).forEach(symptom => {
            message += `  • ${symptom.symptom_name} (${symptom.confidence}% khớp)\n`;
          });
          message += "\n";
        }

        // ICD-10 codes
        if (data.analysis?.icd10_codes?.length > 0) {
          message += `🔸 **Mã ICD-10:** ${data.analysis.icd10_codes.join(", ")}\n\n`;
        }

        // Urgency
        if (data.analysis?.urgency) {
          const urgency = data.analysis.urgency;
          const urgencyEmoji = {
            emergency: "🚨",
            priority: "⚠️",
            normal: "✅"
          }[urgency.urgency_level] || "ℹ️";
          
          message += `${urgencyEmoji} **Mức độ:** ${urgency.urgency_level.toUpperCase()}\n`;
          message += `📋 ${urgency.reason}\n`;
          message += `💡 ${urgency.recommended_action}\n\n`;
        }

        // Suggested departments
        if (data.analysis?.suggested_departments?.length > 0) {
          console.log("✅ Has departments, adding to message...");
          message += "🏥 **Khoa khám được đề xuất:**\n";
          data.analysis.suggested_departments.slice(0, 3).forEach((dept, idx) => {
            const confidence = parseFloat(dept.confidence) * 100;
            message += `  ${idx + 1}. ${dept.department_name} (${Math.round(confidence)}% phù hợp)\n`;
          });
        } else {
          console.log("❌ NO departments suggested!");
        }

        addBotMessage(message, data);

        // Fetch available slots if department suggested
        console.log("🔵 Checking if should fetch slots...");
        if (data.analysis?.suggested_departments?.length > 0) {
          console.log("✅ Will fetch slots for department:", data.analysis.suggested_departments[0]);
          const topDepartment = data.analysis.suggested_departments[0];
          setTimeout(async () => {
            console.log("🔵 Fetching slots for department ID:", topDepartment.department_id);
            addBotMessage("🔍 Đang tìm kiếm lịch hẹn trống trong 7 ngày tới...");
            try {
              // Try multiple dates (next 7 days) to find available slots
              let allSlots = [];
              let foundDate = null;
              
              for (let i = 1; i <= 7; i++) {
                const testDate = new Date();
                testDate.setDate(testDate.getDate() + i);
                const dateStr = testDate.toISOString().split('T')[0];
                
                console.log(`🔵 Trying date ${i}/7: ${dateStr}`);
                const slotsResponse = await getAvailableSlots(
                  topDepartment.department_id,
                  null,
                  dateStr
                );
                
                if (slotsResponse.success && slotsResponse.data?.slots?.length > 0) {
                  allSlots = slotsResponse.data.slots;
                  foundDate = dateStr;
                  console.log(`✅ Found ${allSlots.length} slots on ${dateStr}`);
                  break; // Stop when we find slots
                }
              }
              
              console.log("🔵 Final result:", allSlots.length, "slots");
              
              if (allSlots.length > 0) {
                console.log("✅ Found", allSlots.length, "slots");
                setAvailableSlots(allSlots);
                setCurrentDepartmentId(topDepartment.department_id);
                
                // Format date
                const dateObj = new Date(foundDate);
                const formattedDate = dateObj.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
                
                addBotMessage(
                  `📅 Tìm thấy **${allSlots.length} slot trống** cho khoa **${topDepartment.department_name}**!\n\n` +
                  `📆 Ngày khám: **${formattedDate}**\n\n` +
                  `👇 Vui lòng chọn bác sĩ và giờ khám phù hợp bên dưới:`,
                  { 
                    showSlots: true, 
                    slots: allSlots,
                    departmentId: topDepartment.department_id,
                    departmentName: topDepartment.department_name
                  }
                );
              } else {
                console.log("❌ No slots found in next 7 days");
                addBotMessage(
                  `❌ Hiện tại chưa có slot trống cho khoa **${topDepartment.department_name}** trong 7 ngày tới.\n\n` +
                  `Bạn có thể:\n` +
                  `• Thử lại sau\n` +
                  `• Liên hệ trực tiếp với bệnh viện: 📞 1900-xxxx\n` +
                  `• Đặt lịch qua trang Booking để chọn ngày khác`
                );
              }
            } catch (error) {
              console.error("❌ Error fetching slots:", error);
              addBotMessage(
                "❌ Không thể tải danh sách slot. Vui lòng thử lại hoặc đặt lịch qua trang Booking."
              );
            }
          }, 800);
        } else {
          console.log("❌ No departments to fetch slots for");
        }
      } else {
        console.log("❌ Response not successful:", response);
        addBotMessage("❌ Không thể phân tích triệu chứng. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      addBotMessage(
        "❌ Đã xảy ra lỗi khi phân tích triệu chứng. Vui lòng kiểm tra:\n" +
        "• AI Service có đang chạy không (port 8000)?\n" +
        "• Kết nối mạng có ổn định không?\n\n" +
        "Chi tiết lỗi: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking redirect
  const handleBookAppointment = () => {
    setIsOpen(false);
    navigate("/booking");
  };

  // Handle slot selection and booking
  const handleSelectSlot = async (slot, departmentId) => {
    if (isBooking) return;
    
    setSelectedSlot(slot);
    setIsBooking(true);
    
    addBotMessage(
      `⏳ **Đang xử lý đặt lịch...**\n\n` +
      `👨‍⚕️ Bác sĩ: ${slot.doctor_name || `#${slot.doctor_id}`}\n` +
      `📅 Ngày: ${slot.date}\n` +
      `⏰ Giờ: ${slot.start_time} - ${slot.end_time}\n\n` +
      `Vui lòng đợi...`
    );
    
    try {
      // Create appointment
      const appointmentData = {
        patient_id: user.patient_id || 1, // TODO: Get actual patient_id
        doctor_id: slot.doctor_id,
        department_id: departmentId,
        scheduled_start: `${slot.date} ${slot.start_time}`,
        scheduled_end: `${slot.date} ${slot.end_time}`,
        symptoms: analysisResult?.analysis?.matched_symptoms
          ?.map(s => s.symptom_name)
          .join(", ") || "Triệu chứng từ AI chat",
        urgency_level: analysisResult?.analysis?.urgency?.urgency_level || "normal",
        created_by_user_id: user.user_id || null
      };
      
      const response = await createAppointment(appointmentData);
      
      if (response.success) {
        addBotMessage(
          `🎉 **ĐẶT LỊCH KHÁM THÀNH CÔNG!**\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📋 **Mã lịch hẹn:** #${response.data?.appointment_id || 'N/A'}\n` +
          `👨‍⚕️ **Bác sĩ:** ${slot.doctor_name || `#${slot.doctor_id}`}\n` +
          `🏥 **Khoa:** ${messages.find(m => m.data?.departmentName)?.data?.departmentName || 'N/A'}\n` +
          `📅 **Ngày khám:** ${slot.date}\n` +
          `⏰ **Giờ khám:** ${slot.start_time} - ${slot.end_time}\n` +
          `📍 **Trạng thái:** Đang chờ xác nhận\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `✉️ Email xác nhận sẽ được gửi đến bạn sớm!\n` +
          `📱 Vui lòng đến trước 15 phút để làm thủ tục.\n\n` +
          `💡 Bạn có thể xem chi tiết lịch hẹn trong mục "Lịch sử khám bệnh"`
        );
        
        // Clear slots after successful booking
        setAvailableSlots([]);
        setSelectedSlot(null);
      } else {
        addBotMessage(
          `❌ **Không thể tạo lịch hẹn**\n\n` +
          `Lý do: ${response.message || 'Lỗi không xác định'}\n\n` +
          `Vui lòng:\n` +
          `• Kiểm tra lại thông tin\n` +
          `• Thử slot khác\n` +
          `• Liên hệ hotline: 1900-xxxx`
        );
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      addBotMessage(
        `❌ Đã xảy ra lỗi khi đặt lịch: ${error.message}\n\n` +
        `Vui lòng thử lại sau hoặc đặt lịch qua trang Booking.`
      );
    } finally {
      setIsBooking(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render urgency badge
  const getUrgencyColor = (level) => {
    const colors = {
      emergency: "bg-red-100 text-red-800 border-red-300",
      priority: "bg-orange-100 text-orange-800 border-orange-300",
      normal: "bg-green-100 text-green-800 border-green-300"
    };
    return colors[level] || "bg-gray-100 text-gray-800 border-gray-300";
  };

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
        title={isOpen ? "Đóng chat" : "Mở trợ lý AI"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 w-full max-w-md bg-white rounded-lg shadow-2xl z-40 transition-all duration-300 transform ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        } overflow-hidden flex flex-col`}
        style={{ height: "600px" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <Activity size={20} />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold">Trợ Lý Sức Khỏe AI</h3>
            <div className="flex items-center text-xs text-green-100">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                aiServiceStatus === "online" ? "bg-green-300 animate-pulse" :
                aiServiceStatus === "offline" ? "bg-red-400" : "bg-yellow-400"
              }`}></div>
              {aiServiceStatus === "online" && "Đang hoạt động"}
              {aiServiceStatus === "offline" && "Offline"}
              {aiServiceStatus === "checking" && "Đang kết nối..."}
            </div>
          </div>
          <button
            className="ml-auto text-white/80 hover:text-white transition"
            onClick={() => setIsOpen(false)}
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${
                msg.type === "user"
                  ? "bg-green-600 text-white rounded-lg rounded-tr-none"
                  : "bg-white text-gray-800 border rounded-lg rounded-tl-none shadow-sm"
              } p-3`}>
                <div className="text-sm whitespace-pre-line">{msg.text}</div>
                
                {/* Show slots if available */}
                {msg.data?.showSlots && msg.data?.slots?.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-700 mb-2 px-1">
                      📋 Chọn bác sĩ và giờ khám:
                    </div>
                    {msg.data.slots.map((slot, idx) => (
                      <div 
                        key={idx}
                        className={`border-2 rounded-lg p-3 transition-all duration-200 ${
                          isBooking && selectedSlot?.slot_id === slot.slot_id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer hover:shadow-md"
                        }`}
                        onClick={() => !isBooking && handleSelectSlot(slot, msg.data.departmentId)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Doctor Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {slot.doctor_name ? slot.doctor_name.charAt(0).toUpperCase() : "BS"}
                            </div>
                          </div>
                          
                          {/* Doctor Info */}
                          <div className="flex-grow min-w-0">
                            <div className="font-semibold text-gray-900 flex items-center text-sm mb-1">
                              <UserIcon size={14} className="mr-1 text-green-600 flex-shrink-0" />
                              <span className="truncate">
                                {slot.doctor_name || `Bác sĩ #${slot.doctor_id}`}
                              </span>
                            </div>
                            
                            {/* Specialization if available */}
                            {slot.specialization && (
                              <div className="text-xs text-gray-600 mb-1 flex items-center">
                                <Activity size={11} className="mr-1 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{slot.specialization}</span>
                              </div>
                            )}
                            
                            {/* Date */}
                            <div className="text-xs text-gray-700 flex items-center mb-1">
                              <Calendar size={11} className="mr-1 text-purple-500 flex-shrink-0" />
                              <span className="font-medium">{slot.date}</span>
                            </div>
                            
                            {/* Time */}
                            <div className="text-xs text-gray-700 flex items-center">
                              <Clock size={11} className="mr-1 text-orange-500 flex-shrink-0" />
                              <span className="font-medium">{slot.start_time} - {slot.end_time}</span>
                            </div>
                          </div>
                          
                          {/* Select Button */}
                          <button 
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              isBooking && selectedSlot?.slot_id === slot.slot_id
                                ? "bg-green-100 text-green-700 cursor-wait"
                                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-95"
                            }`}
                            disabled={isBooking}
                            onClick={(e) => {
                              e.stopPropagation();
                              !isBooking && handleSelectSlot(slot, msg.data.departmentId);
                            }}
                          >
                            {isBooking && selectedSlot?.slot_id === slot.slot_id ? (
                              <div className="flex items-center gap-1">
                                <Loader2 size={12} className="animate-spin" />
                                <span>Đang đặt...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <CheckCircle size={12} />
                                <span>Chọn</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show more info */}
                    {msg.data.slots.length > 5 && (
                      <div className="text-xs text-center text-gray-500 pt-2 border-t border-gray-200">
                        Hiển thị {msg.data.slots.length} slot trống
                      </div>
                    )}
                  </div>
                )}
                
                {/* Show appointment button if needed */}
                {msg.data?.showAppointmentButton && (
                  <button
                    onClick={handleBookAppointment}
                    className="mt-3 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center text-sm"
                  >
                    <Calendar size={16} className="mr-2" />
                    Đặt Lịch Hẹn Ngay
                  </button>
                )}

                {/* Timestamp */}
                <div className={`text-xs mt-1 ${
                  msg.type === "user" ? "text-green-100" : "text-gray-400"
                }`}>
                  {msg.timestamp.toLocaleTimeString("vi-VN", { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg rounded-tl-none p-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">Đang xử lý...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-gray-200 bg-white">
          {!user && (
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 flex items-center">
              <AlertCircle size={14} className="mr-2" />
              Bạn cần đăng nhập để sử dụng AI
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              placeholder={
                aiServiceStatus === "offline" 
                  ? "AI Service offline..." 
                  : "Mô tả triệu chứng của bạn..."
              }
              disabled={isLoading || aiServiceStatus === "offline"}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim() || aiServiceStatus === "offline"}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
              title="Gửi"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500 text-center">
  
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
