"""
Patient Manager - Quản lý thông tin bệnh nhân
"""
from typing import Dict, Optional
from config.database import db

class PatientManager:
    def __init__(self):
        self.db = db
    
    def create_patient(self, user_id: int, full_name: str, age: int, 
                      gender: str, phone: str, email: Optional[str] = None) -> Optional[int]:
        """
        Tạo bệnh nhân mới
        
        Trả về:
            patient_id nếu thành công, None nếu thất bại
        """
        try:
            query = """
                INSERT INTO patients (user_id, date_of_birth, phone, emergency_contact)
                VALUES (%s, %s, %s, %s)
            """
            # Tính năm sinh từ tuổi
            from datetime import datetime
            current_year = datetime.now().year
            birth_year = current_year - age
            date_of_birth = f"{birth_year}-01-01"
            
            patient_id = self.db.execute_insert(query, (user_id, date_of_birth, phone, phone))
            
            if patient_id:
                print(f"[OK] Đã tạo patient_id: {patient_id}")
                return patient_id
            else:
                print("[FAIL] Tạo bệnh nhân thất bại")
                return None
                
        except Exception as e:
            print(f"[FAIL] Lỗi khi tạo bệnh nhân: {e}")
            return None
    
    def get_patient_by_id(self, patient_id: int) -> Optional[Dict]:
        """
        Lấy thông tin bệnh nhân theo ID
        """
        try:
            query = """
                SELECT p.patient_id, p.user_id, p.date_of_birth, p.phone, p.emergency_contact,
                       u.first_name, u.last_name, u.email, u.gender
                FROM patients p
                LEFT JOIN users u ON p.user_id = u.user_id
                WHERE p.patient_id = %s
            """
            results = self.db.execute_query(query, (patient_id,))
            
            if results and len(results) > 0:
                return results[0]
            return None
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi lấy thông tin bệnh nhân: {e}")
            return None
    
    def get_patient_by_user_id(self, user_id: int) -> Optional[Dict]:
        """
        Lấy thông tin bệnh nhân theo user_id
        """
        try:
            query = """
                SELECT p.patient_id, p.user_id, p.date_of_birth, p.phone, p.emergency_contact,
                       u.first_name, u.last_name, u.email, u.gender
                FROM patients p
                LEFT JOIN users u ON p.user_id = u.user_id
                WHERE p.user_id = %s
            """
            results = self.db.execute_query(query, (user_id,))
            
            if results and len(results) > 0:
                return results[0]
            return None
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi lấy bệnh nhân theo user_id: {e}")
            return None
    
    def update_patient(self, patient_id: int, **kwargs) -> bool:
        """
        Cập nhật thông tin bệnh nhân
        """
        try:
            # Xây dựng câu query update động
            allowed_fields = ['phone', 'emergency_contact', 'date_of_birth']
            update_fields = []
            params = []
            
            for field, value in kwargs.items():
                if field in allowed_fields:
                    update_fields.append(f"{field} = %s")
                    params.append(value)
            
            if not update_fields:
                return False
            
            params.append(patient_id)
            query = f"""
                UPDATE patients
                SET {', '.join(update_fields)}
                WHERE patient_id = %s
            """
            
            cursor = self.db.connection.cursor()
            cursor.execute(query, params)
            self.db.connection.commit()
            cursor.close()
            
            return True
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi cập nhật bệnh nhân: {e}")
            return False

# Instance singleton
patient_manager = PatientManager()
