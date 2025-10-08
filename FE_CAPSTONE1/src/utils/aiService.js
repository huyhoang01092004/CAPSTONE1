/**
 * AI Service API Client
 * Kết nối với FastAPI AI Service (port 8000)
 */

const AI_SERVICE_URL = "http://localhost:8000";

/**
 * Phân tích toàn bộ triệu chứng và tạo gợi ý khoa khám
 * @param {Object} data - Chat request data
 * @param {Object} data.patient_info - Thông tin bệnh nhân (optional)
 * @param {string} data.symptom_text - Triệu chứng
 * @param {boolean} data.request_appointment - Có tạo lịch hẹn không
 * @param {string} data.preferred_date - Ngày muốn khám (optional)
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeSymptoms = async (data) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/chat/analyze-full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Không thể phân tích triệu chứng");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Error analyzing symptoms:", error);
    throw error;
  }
};

/**
 * Test kết nối với AI Service
 * @returns {Promise<Object>} Health check result
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`);
    if (!response.ok) {
      throw new Error("AI Service không hoạt động");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ AI Service health check failed:", error);
    throw error;
  }
};

/**
 * Xử lý NLP cho text triệu chứng
 * @param {string} symptomText - Text triệu chứng
 * @returns {Promise<Object>} NLP processing result
 */
export const processSymptomText = async (symptomText) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/nlp/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptom_text: symptomText }),
    });

    if (!response.ok) {
      throw new Error("Không thể xử lý text");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error processing text:", error);
    throw error;
  }
};

/**
 * Phân loại mức độ khẩn cấp
 * @param {string} symptomText - Text triệu chứng
 * @returns {Promise<Object>} Urgency classification result
 */
export const classifyUrgency = async (symptomText) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/urgency/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptom_text: symptomText }),
    });

    if (!response.ok) {
      throw new Error("Không thể phân loại mức độ khẩn cấp");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error classifying urgency:", error);
    throw error;
  }
};

/**
 * Lấy slots trống
 * @param {number} departmentId - ID khoa khám
 * @param {number} doctorId - ID bác sĩ (optional)
 * @param {string} date - Ngày khám YYYY-MM-DD (optional)
 * @returns {Promise<Object>} Available slots
 */
export const getAvailableSlots = async (departmentId, doctorId = null, date = null) => {
  try {
    const params = new URLSearchParams({
      department_id: departmentId,
    });
    
    if (doctorId) params.append("doctor_id", doctorId);
    if (date) params.append("date", date);

    const response = await fetch(
      `${AI_SERVICE_URL}/api/appointments/available-slots?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách slot");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error getting available slots:", error);
    throw error;
  }
};

/**
 * Tạo appointment mới
 * @param {Object} appointmentData - Dữ liệu appointment
 * @returns {Promise<Object>} Created appointment result
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/appointments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Không thể tạo lịch hẹn");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    throw error;
  }
};

export default {
  analyzeSymptoms,
  healthCheck,
  processSymptomText,
  classifyUrgency,
  getAvailableSlots,
  createAppointment,
};
