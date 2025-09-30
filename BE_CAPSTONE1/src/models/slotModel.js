import db from "../config/db.js";

// Lấy các appointment của 1 bác sĩ trong 1 ngày (chỉ tính lịch chưa hủy)
export const getAppointments = async (doctor_id, date) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM appointments 
     WHERE doctor_id = ?
       AND DATE(scheduled_start) = ?
       AND status IN ('pending', 'confirmed')`, // chỉ lấy lịch đã book hợp lệ
    [doctor_id, date]
  );
  return rows;
};
