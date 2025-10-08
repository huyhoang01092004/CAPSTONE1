"""
Symptom Matcher - So khớp triệu chứng với database
"""
from typing import List, Dict, Optional
from config.database import db
from .nlp_processor import nlp_processor
from .translator import translator

class SymptomMatcher:
    def __init__(self):
        self.db = db
    
    def get_all_symptoms_from_db(self) -> List[Dict]:
        """
        Lấy tất cả triệu chứng từ database (cả tiếng Anh và tiếng Việt)
        Trả về: Danh sách {symptom_id, name, name_vi, icd10_code}
        """
        try:
            print("[DEBUG] Đang lấy triệu chứng từ database...")
            query = """
                SELECT symptom_id, name, name_vi, icd10_code
                FROM symptoms
            """
            results = self.db.execute_query(query)
            if results:
                print(f"[DEBUG] Đã tải {len(results)} triệu chứng từ database")
                # Không in text tiếng Việt - gây lỗi encoding trên Windows console
            else:
                print("[DEBUG] Không có triệu chứng nào từ database (results là None hoặc rỗng)")
            return results if results else []
        except Exception as e:
            print(f"[LỖI] Lỗi khi lấy triệu chứng từ DB: {str(e)[:100]}")  # Giới hạn độ dài thông báo lỗi
            return []
    
    def match_symptoms(self, input_text: str, fuzzy_threshold: int = 70) -> List[Dict]:
        """
        So khớp triệu chứng từ text với database (hỗ trợ cả tiếng Việt và tiếng Anh)
        
        Trả về:
            Danh sách {
                "symptom_id": int,
                "symptom_name": str,
                "symptom_name_vi": str,
                "match_type": "exact" | "fuzzy",
                "confidence": int,
                "icd10_code": str
            }
        """
        print(f"[DEBUG] match_symptoms được gọi với đầu vào: '{input_text}'")
        
        # Phát hiện ngôn ngữ
        detected_lang = translator.detect_language(input_text)
        print(f"[DEBUG] Ngôn ngữ phát hiện: {detected_lang}")
        
        # Lấy tất cả triệu chứng từ DB
        symptoms_db = self.get_all_symptoms_from_db()
        
        if not symptoms_db:
            print("[DEBUG] Không có triệu chứng từ DB, trả về danh sách rỗng")
            return []
        
        # Chuẩn bị danh sách triệu chứng để matching
        if detected_lang == "vi":
            # Khớp với tên tiếng Việt
            symptom_list = [s["name_vi"] for s in symptoms_db if s.get("name_vi")]
            print(f"[DEBUG] Đang khớp với {len(symptom_list)} tên triệu chứng tiếng Việt")
            matches = nlp_processor.combined_match_symptom(input_text, symptom_list, fuzzy_threshold)
            
            # Ánh xạ ngược sử dụng name_vi
            results = []
            for match in matches:
                symptom_name_vi = match["symptom"]
                symptom_data = next(
                    (s for s in symptoms_db if s.get("name_vi") == symptom_name_vi), 
                    None
                )
                if symptom_data:
                    results.append({
                        "symptom_id": symptom_data["symptom_id"],
                        "symptom_name": symptom_data["name"],  # Tiếng Anh
                        "symptom_name_vi": symptom_data["name_vi"],  # Tiếng Việt
                        "match_type": match["match_type"],
                        "confidence": match["confidence"],
                        "icd10_code": symptom_data.get("icd10_code", "")
                    })
        else:
            # Khớp với tên tiếng Anh
            symptom_list = [s["name"] for s in symptoms_db if s.get("name")]
            print(f"[DEBUG] Đang khớp với {len(symptom_list)} tên triệu chứng tiếng Anh")
            matches = nlp_processor.combined_match_symptom(input_text, symptom_list, fuzzy_threshold)
            
            # Ánh xạ ngược sử dụng name
            results = []
            for match in matches:
                symptom_name = match["symptom"]
                symptom_data = next(
                    (s for s in symptoms_db if s.get("name") == symptom_name), 
                    None
                )
                if symptom_data:
                    results.append({
                        "symptom_id": symptom_data["symptom_id"],
                        "symptom_name": symptom_data["name"],  # English
                        "symptom_name_vi": symptom_data.get("name_vi", ""),  # Vietnamese
                        "match_type": match["match_type"],
                        "confidence": match["confidence"],
                        "icd10_code": symptom_data.get("icd10_code", "")
                    })
        
        print(f"[DEBUG] Matched {len(results)} symptoms")
        return results
    
    def get_icd10_codes(self, symptom_ids: List[int]) -> List[str]:
        """
        Lấy danh sách ICD-10 codes từ symptom_ids
        """
        if not symptom_ids:
            return []
        
        try:
            placeholders = ','.join(['%s'] * len(symptom_ids))
            query = f"""
                SELECT DISTINCT icd10_code
                FROM symptoms
                WHERE symptom_id IN ({placeholders})
                AND icd10_code IS NOT NULL
                AND icd10_code != ''
            """
            results = self.db.execute_query(query, symptom_ids)
            
            return [r["icd10_code"] for r in results] if results else []
        except Exception as e:
            print(f"[FAIL] Lỗi khi lấy mã ICD-10: {e}")
            return []
    
    def get_departments_by_symptoms(self, symptom_ids: List[int]) -> List[Dict]:
        """
        Lấy danh sách khoa khám từ symptom_ids với thuật toán cải tiến
        
        Sử dụng weighted scoring để xếp hạng chính xác:
        - Số lượng triệu chứng map với mỗi khoa
        - Độ tin cậy (confidence) của mỗi mapping
        - Điểm tổng hợp = (số triệu chứng * avg confidence * 100)
        
        Returns:
            List of {
                "department_id": int,
                "department_name": str,
                "department_description": str,
                "matched_symptom_count": int,
                "total_symptom_count": int,
                "avg_confidence": float,
                "score": float,
                "confidence_label": str
            }
        """
        if not symptom_ids:
            return []
        
        try:
            placeholders = ','.join(['%s'] * len(symptom_ids))
            query = f"""
                SELECT 
                    d.department_id,
                    d.name as department_name,
                    d.description as department_description,
                    COUNT(DISTINCT sdm.symptom_id) as matched_symptom_count,
                    AVG(sdm.confidence) as avg_confidence,
                    MAX(sdm.confidence) as max_confidence,
                    MIN(sdm.confidence) as min_confidence
                FROM symptom_department_mapping sdm
                JOIN departments d ON sdm.department_id = d.department_id
                WHERE sdm.symptom_id IN ({placeholders})
                GROUP BY d.department_id, d.name, d.description
                HAVING COUNT(DISTINCT sdm.symptom_id) > 0
                ORDER BY 
                    matched_symptom_count DESC,
                    avg_confidence DESC,
                    max_confidence DESC
            """
            results = self.db.execute_query(query, symptom_ids)
            
            if not results:
                return []
            
            # Tính điểm trọng số và thêm nhãn độ tin cậy
            total_symptoms = len(symptom_ids)
            enhanced_results = []
            
            for dept in results:
                matched = dept['matched_symptom_count']
                avg_conf = float(dept['avg_confidence'])
                
                # Điểm trọng số: số triệu chứng match * độ tin cậy trung bình * 100
                # Thưởng thêm nếu match nhiều triệu chứng
                coverage_bonus = 1.0 + (matched / total_symptoms) * 0.5
                score = matched * avg_conf * 100 * coverage_bonus
                
                # Nhãn độ tin cậy
                if avg_conf >= 0.85:
                    conf_label = "Rất phù hợp"
                elif avg_conf >= 0.75:
                    conf_label = "Phù hợp"
                elif avg_conf >= 0.65:
                    conf_label = "Có thể phù hợp"
                else:
                    conf_label = "Ít phù hợp"
                
                enhanced_results.append({
                    "department_id": dept['department_id'],
                    "department_name": dept['department_name'],
                    "department_description": dept.get('department_description', ''),
                    "matched_symptom_count": matched,
                    "total_symptom_count": total_symptoms,
                    "avg_confidence": round(avg_conf, 2),
                    "max_confidence": round(float(dept['max_confidence']), 2),
                    "min_confidence": round(float(dept['min_confidence']), 2),
                    "score": round(score, 2),
                    "confidence_label": conf_label,
                    "match_percentage": round((matched / total_symptoms) * 100, 1)
                })
            
            # Sắp xếp theo điểm giảm dần
            enhanced_results.sort(key=lambda x: x['score'], reverse=True)
            
            print(f"[DEBUG] Tìm thấy {len(enhanced_results)} khoa cho {total_symptoms} triệu chứng")
            for dept in enhanced_results[:3]:
                print(f"  - {dept['department_name']}: {dept['matched_symptom_count']}/{total_symptoms} triệu chứng, "
                      f"conf={dept['avg_confidence']}, điểm={dept['score']:.1f}")
            
            return enhanced_results
            
        except Exception as e:
            print(f"[FAIL] Lỗi khi lấy danh sách khoa: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def analyze_symptom_text(self, input_text: str) -> Dict:
        """
        Phân tích toàn bộ text triệu chứng với AI cải tiến
        
        Trả về:
            {
                "processed": Dict,  # Kết quả xử lý NLP
                "matched_symptoms": List[Dict],  # Danh sách triệu chứng match được
                "icd10_codes": List[str],  # Mã ICD-10
                "suggested_departments": List[Dict],  # Khoa đề xuất với scoring chi tiết
                "analysis_summary": Dict  # Tóm tắt phân tích
            }
        """
        # Xử lý text với NLP
        processed = nlp_processor.process_symptom_text(input_text)
        
        # Khớp triệu chứng
        matched_symptoms = self.match_symptoms(input_text)
        
        # Lấy mã ICD-10
        symptom_ids = [s["symptom_id"] for s in matched_symptoms]
        icd10_codes = self.get_icd10_codes(symptom_ids)
        
        # Lấy danh sách khoa đề xuất với điểm số cải tiến
        suggested_departments = self.get_departments_by_symptoms(symptom_ids)
        
        # Tạo tóm tắt phân tích
        analysis_summary = {
            "total_symptoms_found": len(matched_symptoms),
            "language_detected": processed.get("language", "unknown"),
            "departments_suggested": len(suggested_departments),
            "top_department": suggested_departments[0]["department_name"] if suggested_departments else None,
            "top_department_confidence": suggested_departments[0]["confidence_label"] if suggested_departments else None,
            "icd10_codes_count": len(icd10_codes),
            "recommendation": self._generate_recommendation(matched_symptoms, suggested_departments)
        }
        
        return {
            "processed": processed,
            "matched_symptoms": matched_symptoms,
            "icd10_codes": icd10_codes,
            "suggested_departments": suggested_departments,
            "analysis_summary": analysis_summary
        }
    
    def _generate_recommendation(self, matched_symptoms: List[Dict], departments: List[Dict]) -> str:
        """
        Tạo lời khuyên dựa trên phân tích
        """
        if not matched_symptoms:
            return "Không tìm thấy triệu chứng rõ ràng. Vui lòng mô tả chi tiết hơn."
        
        if not departments:
            return f"Phát hiện {len(matched_symptoms)} triệu chứng nhưng chưa xác định được khoa phù hợp. Vui lòng liên hệ tổng đài để được tư vấn."
        
        top_dept = departments[0]
        symptom_names = [s.get("symptom_name_vi", s["symptom_name"]) for s in matched_symptoms[:3]]
        symptom_str = ", ".join(symptom_names)
        
        if top_dept["matched_symptom_count"] == len(matched_symptoms) and top_dept["avg_confidence"] >= 0.85:
            return f"Dựa trên các triệu chứng: {symptom_str}, bạn nên khám tại khoa {top_dept['department_name']}. Độ chính xác: {top_dept['confidence_label']}."
        elif top_dept["avg_confidence"] >= 0.75:
            return f"Với triệu chứng: {symptom_str}, khoa {top_dept['department_name']} là lựa chọn phù hợp nhất. Bác sĩ sẽ kiểm tra và tư vấn thêm."
        else:
            dept_names = [d['department_name'] for d in departments[:2]]
            return f"Triệu chứng của bạn có thể liên quan đến nhiều chuyên khoa ({', '.join(dept_names)}). Nên đặt lịch để bác sĩ thăm khám và xác định chính xác."


# Instance singleton
symptom_matcher = SymptomMatcher()
