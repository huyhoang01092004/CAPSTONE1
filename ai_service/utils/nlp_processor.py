"""
NLP Processor - Xử lý triệu chứng bằng spaCy + scispaCy
"""
import spacy
from typing import List, Dict, Tuple
import re
from fuzzywuzzy import fuzz, process
from underthesea import word_tokenize
from .vietnamese_synonyms import expand_with_synonyms

class NLPProcessor:
    def __init__(self):
        """Khởi tạo spaCy models"""
        try:
            # Tải mô hình tiếng Anh tổng quát
            self.nlp_en = spacy.load("en_core_web_sm")
            print("[OK] Đã tải en_core_web_sm")
        except Exception as e:
            print(f"[CẢNH BÁO] Không thể tải en_core_web_sm: {e}")
            self.nlp_en = None
        
        # Thử tải mô hình Biomedical NER (tùy chọn)
        self.nlp_bio = None
        # TẠM THỜI VÔ HIỆU HÓA - Vấn đề tải mô hình
        # try:
        #     self.nlp_bio = spacy.load("en_ner_bc5cdr_md")
        #     print("[OK] Đã tải en_ner_bc5cdr_md (Y sinh)")
        # except Exception as e:
        #     print(f"[CẢNH BÁO] Không thể tải en_ner_bc5cdr_md: {e}")
        #     print("[THÔNG TIN] Sẽ sử dụng en_core_web_sm để trích xuất entity")
        print("[THÔNG TIN] Mô hình Y sinh đã vô hiệu - chỉ sử dụng en_core_web_sm")
    
    def preprocess_text(self, text: str) -> str:
        """Tiền xử lý text đầu vào"""
        # Chuyển thành chữ thường
        text = text.lower().strip()
        
        # Loại bỏ khoảng trắng thừa
        text = re.sub(r'\s+', ' ', text)
        
        # Loại bỏ ký tự đặc biệt nhưng giữ ký tự tiếng Việt
        text = re.sub(r'[^\w\s\u00C0-\u1EF9]', ' ', text)
        
        return text.strip()
    
    def extract_entities(self, text: str) -> List[Dict]:
        """
        Trích xuất entities từ text bằng Biomedical NER
        Trả về: Danh sách entities với text, label, start, end
        """
        entities = []
        
        # Sử dụng mô hình y sinh nếu có, nếu không dùng mô hình tổng quát
        nlp_model = self.nlp_bio if self.nlp_bio else self.nlp_en
        
        if not nlp_model:
            return entities
        
        try:
            doc = nlp_model(text)
            
            for ent in doc.ents:
                entities.append({
                    "text": ent.text,
                    "label": ent.label_,  # DISEASE, CHEMICAL, v.v.
                    "start": ent.start_char,
                    "end": ent.end_char
                })
        except Exception as e:
            print(f"[LỖI] Lỗi khi trích xuất entities: {e}")
        
        return entities
    
    def tokenize_vietnamese(self, text: str) -> List[str]:
        """
        Tách từ tiếng Việt bằng underthesea
        """
        try:
            tokens = word_tokenize(text, format="text")
            return tokens.split()
        except Exception as e:
            print(f"[LỖI] Lỗi khi tách từ tiếng Việt: {e}")
            return text.split()
    
    def extract_keywords(self, text: str, language: str = "en") -> List[str]:
        """
        Trích xuất từ khóa từ text
        language: 'en' hoặc 'vi'
        """
        keywords = []
        
        if language == "vi":
            # Xử lý tiếng Việt
            tokens = self.tokenize_vietnamese(text)
            # Loại bỏ stopwords (danh sách cơ bản)
            stopwords_vi = {'tôi', 'bị', 'đang', 'có', 'là', 'và', 'với', 'của', 'một', 'các', 'được', 'trong'}
            keywords = [token for token in tokens if token.lower() not in stopwords_vi and len(token) > 1]
        else:
            # Xử lý tiếng Anh
            if self.nlp_en:
                doc = self.nlp_en(text)
                keywords = [
                    token.text.lower() 
                    for token in doc 
                    if not token.is_stop and not token.is_punct and len(token.text) > 2
                ]
        
        return keywords
    
    def detect_language(self, text: str) -> str:
        """
        Phát hiện ngôn ngữ của text
        Trả về: 'vi' hoặc 'en'
        """
        # Phát hiện đơn giản dựa trên ký tự tiếng Việt
        vietnamese_chars = re.findall(r'[\u00C0-\u1EF9]', text)
        
        if len(vietnamese_chars) > 0:
            return "vi"
        return "en"
    
    def process_symptom_text(self, text: str) -> Dict:
        """
        Xử lý toàn bộ text triệu chứng
        Returns: {
            "original_text": str,
            "preprocessed_text": str,
            "language": str,
            "keywords": List[str],
            "entities": List[Dict],
            "tokens": List[str]
        }
        """
        # Preprocess
        preprocessed = self.preprocess_text(text)
        
        # Detect language
        language = self.detect_language(text)
        
        # Extract keywords
        keywords = self.extract_keywords(preprocessed, language)
        
        # Extract medical entities (for English text)
        entities = []
        if language == "en":
            entities = self.extract_entities(preprocessed)
        
        # Tokenize
        if language == "vi":
            tokens = self.tokenize_vietnamese(preprocessed)
        else:
            tokens = preprocessed.split()
        
        return {
            "original_text": text,
            "preprocessed_text": preprocessed,
            "language": language,
            "keywords": keywords,
            "entities": entities,
            "tokens": tokens
        }
    
    def fuzzy_match_symptom(self, input_text: str, symptom_list: List[str], threshold: int = 70) -> List[Tuple[str, int]]:
        """
        So khớp triệu chứng bằng fuzzy matching
        
        Args:
            input_text: Text đầu vào
            symptom_list: Danh sách triệu chứng từ database
            threshold: Ngưỡng độ tin cậy (0-100)
        
        Returns:
            Danh sách tuple (triệu chứng, điểm số)
        """
        matches = []
        
        # Tiền xử lý đầu vào
        processed_input = self.preprocess_text(input_text)
        keywords = self.extract_keywords(processed_input)
        
        # Khớp mỗi từ khóa với danh sách triệu chứng
        for keyword in keywords:
            # Tìm kết quả khớp tốt nhất
            results = process.extract(
                keyword, 
                symptom_list, 
                scorer=fuzz.token_sort_ratio,
                limit=3
            )
            
            for symptom, score in results:
                if score >= threshold:
                    matches.append((symptom, score))
        
        # Loại bỏ trùng lặp và sắp xếp theo điểm
        unique_matches = list(set(matches))
        unique_matches.sort(key=lambda x: x[1], reverse=True)
        
        return unique_matches
    
    def exact_match_symptom(self, input_text: str, symptom_list: List[str]) -> List[str]:
        """
        Tìm khớp chính xác trong text
        """
        matches = []
        processed_input = self.preprocess_text(input_text)
        
        for symptom in symptom_list:
            processed_symptom = self.preprocess_text(symptom)
            if processed_symptom in processed_input:
                matches.append(symptom)
        
        return matches
    
    def combined_match_symptom(self, input_text: str, symptom_list: List[str], fuzzy_threshold: int = 70) -> List[Dict]:
        """
        Kết hợp exact match + fuzzy match + mở rộng từ đồng nghĩa tiếng Việt
        
        Returns:
            Danh sách {
                "symptom": str,
                "match_type": "exact" | "fuzzy" | "synonym",
                "confidence": int (0-100)
            }
        """
        results = []
        processed_input = self.preprocess_text(input_text)
        
        # BƯỚC 1: Mở rộng đầu vào tiếng Việt với từ đồng nghĩa
        expanded_terms = expand_with_synonyms(processed_input)
        print(f"[DEBUG] Đầu vào '{processed_input}' mở rộng thành {len(expanded_terms)} từ đồng nghĩa")
        
        # BƯỚC 2: Khớp chính xác (độ tin cậy = 100) trên bản gốc và các từ mở rộng
        all_search_terms = [processed_input] + expanded_terms
        exact_matches = set()
        
        for search_term in all_search_terms:
            for symptom in symptom_list:
                processed_symptom = self.preprocess_text(symptom)
                if processed_symptom in search_term or search_term in processed_symptom:
                    exact_matches.add(symptom)
        
        for symptom in exact_matches:
            results.append({
                "symptom": symptom,
                "match_type": "exact",
                "confidence": 100
            })
        
        # BƯỚC 3: Fuzzy matches trên các từ mở rộng
        for search_term in all_search_terms:
            fuzzy_matches = self.fuzzy_match_symptom(search_term, symptom_list, fuzzy_threshold)
            for symptom, score in fuzzy_matches:
                # Bỏ qua nếu đã có trong exact matches
                if symptom not in exact_matches:
                    # Kiểm tra nếu đã thêm với điểm thấp hơn
                    existing = next((r for r in results if r["symptom"] == symptom), None)
                    if existing:
                        # Giữ điểm cao hơn
                        if score > existing["confidence"]:
                            existing["confidence"] = score
                            existing["match_type"] = "synonym" if search_term != processed_input else "fuzzy"
                    else:
                        results.append({
                            "symptom": symptom,
                            "match_type": "synonym" if search_term != processed_input else "fuzzy",
                            "confidence": score
                        })
        
        # Sắp xếp theo độ tin cậy
        results.sort(key=lambda x: x["confidence"], reverse=True)
        
        return results

# Singleton instance
nlp_processor = NLPProcessor()

