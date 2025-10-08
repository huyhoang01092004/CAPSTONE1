"""
Appointment Manager - Quản lý lịch hẹn
"""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from config.database import db

class AppointmentManager:
    def __init__(self):
        self.db = db
    
    def get_available_slots(self, department_id: int, doctor_id: Optional[int] = None, 
                           date: Optional[str] = None) -> List[Dict]:
        """
        Lấy danh sách slot trống
        
        Args:
            department_id: ID khoa khám
            doctor_id: ID bác sĩ (optional)
            date: Ngày khám (YYYY-MM-DD) (optional, mặc định là hôm nay)
        
        Returns:
            Danh sách các slot trống
        """
        try:
            if not date:
                date = datetime.now().strftime("%Y-%m-%d")
            
            # Lấy giờ làm việc
            if doctor_id:
                query = """
                    SELECT dwh.doctor_id, dwh.day_of_week, dwh.start_time, dwh.end_time,
                           CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
                           d.specialties, d.experience,
                           dept.name as department_name
                    FROM doctor_working_hours dwh
                    JOIN doctors d ON dwh.doctor_id = d.doctor_id
                    JOIN users u ON d.user_id = u.user_id
                    LEFT JOIN departments dept ON d.department_id = dept.department_id
                    WHERE dwh.doctor_id = %s
                """
                params = (doctor_id,)
            else:
                query = """
                    SELECT dwh.doctor_id, dwh.day_of_week, dwh.start_time, dwh.end_time,
                           CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
                           d.specialties, d.experience,
                           dept.name as department_name
                    FROM doctor_working_hours dwh
                    JOIN doctors d ON dwh.doctor_id = d.doctor_id
                    JOIN users u ON d.user_id = u.user_id
                    LEFT JOIN departments dept ON d.department_id = dept.department_id
                    WHERE d.department_id = %s
                """
                params = (department_id,)
            
            working_hours = self.db.execute_query(query, params)
            
            if not working_hours:
                return []
            
            # Lấy ngày trong tuần (1=Thứ 2, 2=Thứ 3, ..., 6=Thứ 7, 0=Chủ Nhật)
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            day_of_week = date_obj.isoweekday()  # 1-7 (Thứ 2-Chủ Nhật)
            if day_of_week == 7:  # Chủ Nhật
                day_of_week = 0
            
            # Lọc theo ngày trong tuần
            available_slots = []
            for wh in working_hours:
                if wh['day_of_week'] == day_of_week:
                    # Kiểm tra slot đã được đặt chưa
                    check_query = """
                        SELECT COUNT(*) as count
                        FROM appointments
                        WHERE doctor_id = %s
                        AND DATE(scheduled_start) = %s
                        AND status != 'cancelled'
                    """
                    result = self.db.execute_query(check_query, (wh['doctor_id'], date))
                    
                    if result and result[0]['count'] < 10:  # Tối đa 10 lịch hẹn mỗi ngày
                        available_slots.append({
                            "slot_id": f"{wh['doctor_id']}_{date}_{wh['start_time']}",
                            "doctor_id": wh['doctor_id'],
                            "doctor_name": wh['doctor_name'],
                            "specialties": wh.get('specialties'),
                            "experience": wh.get('experience'),
                            "department_name": wh.get('department_name'),
                            "date": date,
                            "start_time": str(wh['start_time']),
                            "end_time": str(wh['end_time']),
                            "available": True
                        })
            
            return available_slots
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi lấy slot trống: {e}")
            return []
    
    def create_appointment(self, patient_id: int, doctor_id: int, department_id: int,
                          scheduled_start: str, scheduled_end: str, symptoms: str,
                          urgency_level: str = "normal", created_by_user_id: Optional[int] = None) -> Optional[int]:
        """
        Tạo lịch hẹn mới
        
        Args:
            patient_id: ID bệnh nhân
            doctor_id: ID bác sĩ
            department_id: ID khoa
            scheduled_start: Thời gian bắt đầu (YYYY-MM-DD HH:MM:SS)
            scheduled_end: Thời gian kết thúc (YYYY-MM-DD HH:MM:SS)
            symptoms: Triệu chứng/lý do khám
            urgency_level: Mức độ khẩn cấp (emergency/priority/normal)
            created_by_user_id: ID user tạo (optional)
        
        Returns:
            appointment_id nếu thành công
        """
        try:
            # Đặt trạng thái dựa trên mức độ khẩn cấp
            status_map = {
                "emergency": "confirmed",
                "priority": "pending",
                "normal": "pending"
            }
            status = status_map.get(urgency_level, "pending")
            
            query = """
                INSERT INTO appointments 
                (patient_id, doctor_id, department_id, scheduled_start, scheduled_end,
                 status, reason, booking_channel, created_by_user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            params = (
                patient_id, 
                doctor_id, 
                department_id,
                scheduled_start, 
                scheduled_end,
                status, 
                symptoms,
                'ai',  # booking_channel = 'ai' (chatbot)
                created_by_user_id
            )
            
            appointment_id = self.db.execute_insert(query, params)
            
            if appointment_id:
                print(f"[OK] Đã tạo appointment_id: {appointment_id}")
                return appointment_id
            else:
                print("[FAIL] Tạo lịch hẹn thất bại")
                return None
                
        except Exception as e:
            print(f"[FAIL] Lỗi khi tạo lịch hẹn: {e}")
            return None
    
    def get_appointment_by_id(self, appointment_id: int) -> Optional[Dict]:
        """
        Lấy thông tin lịch hẹn
        """
        try:
            query = """
                SELECT a.*, 
                       CONCAT(u1.first_name, ' ', u1.last_name) as patient_name,
                       CONCAT(u2.first_name, ' ', u2.last_name) as doctor_name,
                       d.name as department_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                JOIN users u1 ON p.user_id = u1.user_id
                JOIN doctors doc ON a.doctor_id = doc.doctor_id
                JOIN users u2 ON doc.user_id = u2.user_id
                JOIN departments d ON doc.department_id = d.department_id
                WHERE a.appointment_id = %s
            """
            results = self.db.execute_query(query, (appointment_id,))
            
            if results and len(results) > 0:
                return results[0]
            return None
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi lấy thông tin lịch hẹn: {e}")
            return None
    
    def update_appointment_status(self, appointment_id: int, status: str) -> bool:
        """
        Cập nhật trạng thái lịch hẹn
        """
        try:
            query = """
                UPDATE appointments
                SET status = %s
                WHERE appointment_id = %s
            """
            
            cursor = self.db.connection.cursor()
            cursor.execute(query, (status, appointment_id))
            self.db.connection.commit()
            cursor.close()
            
            return True
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi cập nhật trạng thái lịch hẹn: {e}")
            return False
    
    def save_ai_recommendation(self, appointment_id: int, input_text: str, 
                               icd10_codes: List[str], symptoms: List[str],
                               department_id: int, urgency: str, confidence: float) -> bool:
        """
        Lưu kết quả phân tích AI
        """
        try:
            query = """
                INSERT INTO ai_recommendations
                (appointment_id, input_text, icd10_codes, detected_symptoms,
                 recommended_department_id, urgency_level, confidence_score, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
            """
            
            # Chuyển đổi list sang chuỗi JSON
            import json
            icd10_str = json.dumps(icd10_codes)
            symptoms_str = json.dumps(symptoms)
            
            result = self.db.execute_insert(
                query,
                (appointment_id, input_text, icd10_str, symptoms_str, 
                 department_id, urgency, confidence)
            )
            
            return result is not None
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi lưu kết quả phân tích AI: {e}")
            return False

# Instance singleton
appointment_manager = AppointmentManager()
