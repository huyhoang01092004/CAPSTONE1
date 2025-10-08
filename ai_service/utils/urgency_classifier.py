"""
Urgency Classifier - Xác định mức độ khẩn cấp
"""
from typing import Dict, List
import re

class UrgencyClassifier:
    def __init__(self):
        # Từ khóa cấp cứu
        self.emergency_keywords_vi = [
            'đau ngực', 'khó thở', 'ngất', 'ngất xỉu', 'choáng váng', 'hôn mê',
            'xuất huyết', 'chảy máu nhiều', 'gãy xương', 'tai nạn', 'bỏng nặng',
            'co giật', 'sốc', 'mất ý thức', 'đột quỵ', 'nhồi máu', 'đau tim',
            'khó thở nặng', 'thở gấp', 'suy hô hấp'
        ]
        
        self.emergency_keywords_en = [
            'chest pain', 'difficulty breathing', 'fainting', 'unconscious', 
            'severe bleeding', 'hemorrhage', 'fracture', 'accident', 'severe burn',
            'seizure', 'shock', 'stroke', 'heart attack', 'myocardial infarction',
            'respiratory distress', 'shortness of breath'
        ]
        
        # Từ khóa ưu tiên
        self.priority_keywords_vi = [
            'sốt cao', 'sốt trên 39', 'nôn nhiều', 'tiêu chảy nặng', 
            'đau bụng dữ dội', 'đau đầu dữ dội', 'chóng mặt',            
            'buồn nôn', 'ói mửa', 'mệt mỏi nặng', 'yếu người',
            'khó nuốt', 'ho ra máu', 'đau lưng dữ dội'
        ]
        
        self.priority_keywords_en = [
            'high fever', 'fever over 39', 'severe vomiting', 'severe diarrhea',
            'severe abdominal pain', 'severe headache', 'dizziness', 'nausea',
            'vomiting', 'extreme fatigue', 'weakness', 'difficulty swallowing',
            'coughing blood', 'severe back pain'
        ]
        
        # Từ khóa bình thường
        self.normal_keywords_vi = [
            'ho nhẹ', 'ho khan', 'cảm cúm', 'sổ mũi', 'đau họng', 'nhức đầu nhẹ',
            'mệt mỏi nhẹ', 'khó ngủ', 'đau nhức cơ', 'dị ứng',
            'ngứa', 'phát ban', 'đau răng', 'đau khớp nhẹ', 'sốt nhẹ',
            'chảy nước mũi', 'hắt hơi', 'ngạt mũi'
        ]
        
        self.normal_keywords_en = [
            'mild cough', 'dry cough', 'cough', 'cold', 'runny nose', 'sore throat', 
            'mild headache', 'mild fatigue', 'insomnia', 'muscle pain', 'allergy',
            'itching', 'rash', 'toothache', 'mild joint pain', 'sneezing',
            'nasal congestion', 'stuffy nose'
        ]
    
    def check_keywords(self, text: str, keywords: List[str]) -> List[str]:
        """
        Kiểm tra text có chứa keywords không
        Trả về: Danh sách các keyword khớp
        """
        text_lower = text.lower()
        matches = []
        
        for keyword in keywords:
            if keyword.lower() in text_lower:
                matches.append(keyword)
        
        return matches
    
    def classify_urgency(self, symptom_text: str, icd10_codes: List[str] = None) -> Dict:
        """
        Xác định mức độ khẩn cấp
        
        Args:
            symptom_text: Text triệu chứng
            icd10_codes: Danh sách mã ICD-10 (optional)
        
        Returns:
            {
                "urgency_level": "emergency" | "priority" | "normal",
                "urgency_score": int (1-10),
                "matched_keywords": List[str],
                "reason": str,
                "recommended_action": str
            }
        """
        # Mã ICD-10 cấp cứu (chỉ mã cụ thể, không phải danh mục rộng)
        # I21: Nhồi máu cơ tim cấp
        # I46: Ngừng tim
        # I50: Suy tim
        # R40.2: Hôn mê
        # S: Mã chấn thương
        # T: Mã ngộ độc
        emergency_icd10_codes = ['I21', 'I46', 'I50', 'R40.2', 'R57', 'R09.2']  # Đã loại bỏ R00, R06
        emergency_icd10_prefixes = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'T']  # Chấn thương/ngộ độc cụ thể
        
        # Kiểm tra từ khóa cấp cứu
        emergency_matches_vi = self.check_keywords(symptom_text, self.emergency_keywords_vi)
        emergency_matches_en = self.check_keywords(symptom_text, self.emergency_keywords_en)
        emergency_matches = emergency_matches_vi + emergency_matches_en
        
        # Kiểm tra mã ICD-10 cấp cứu
        emergency_icd10 = False
        if icd10_codes:
            for code in icd10_codes:
                # Check exact matches
                if code in emergency_icd10_codes:
                    emergency_icd10 = True
                    break
                # Check prefixes for injuries
                for prefix in emergency_icd10_prefixes:
                    if code.startswith(prefix):
                        emergency_icd10 = True
                        break
        
        if emergency_matches or emergency_icd10:
            return {
                "urgency_level": "emergency",
                "urgency_score": 10,
                "matched_keywords": emergency_matches,
                "reason": "Phát hiện triệu chứng cấp cứu",
                "recommended_action": "CẦN ĐẾN KHOA CẤP CỨU NGAY LẬP TỨC hoặc GỌI 115"
            }
        
        # Check priority keywords
        priority_matches_vi = self.check_keywords(symptom_text, self.priority_keywords_vi)
        priority_matches_en = self.check_keywords(symptom_text, self.priority_keywords_en)
        priority_matches = priority_matches_vi + priority_matches_en
        
        if priority_matches:
            # Calculate score based on number of matches (6-8 range)
            score = min(6 + len(priority_matches), 8)
            return {
                "urgency_level": "priority",
                "urgency_score": score,
                "matched_keywords": priority_matches,
                "reason": "Triệu chứng cần ưu tiên khám",
                "recommended_action": "Nên đặt lịch khám TRONG NGÀY hoặc sớm nhất có thể"
            }
        
        # Check normal keywords
        normal_matches_vi = self.check_keywords(symptom_text, self.normal_keywords_vi)
        normal_matches_en = self.check_keywords(symptom_text, self.normal_keywords_en)
        normal_matches = normal_matches_vi + normal_matches_en
        
        # Calculate score based on number of symptoms (2-4 range)
        score = min(2 + len(normal_matches), 4)
        
        return {
            "urgency_level": "normal",
            "urgency_score": score,
            "matched_keywords": normal_matches,
            "reason": "Triệu chứng thông thường" if normal_matches else "Không xác định rõ mức độ",
            "recommended_action": "Có thể đặt lịch khám trong vài ngày tới"
        }
    
    def get_urgency_color(self, urgency_level: str) -> str:
        """
        Lấy màu hiển thị cho urgency level
        """
        colors = {
            "emergency": "#ff0000",  # Đỏ
            "priority": "#ff9800",   # Cam
            "normal": "#4caf50"      # Xanh lá
        }
        return colors.get(urgency_level, "#808080")

# Instance singleton
urgency_classifier = UrgencyClassifier()
