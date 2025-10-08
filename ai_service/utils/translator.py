"""
Simple Translation Service
Dịch tiếng Việt <-> tiếng Anh
"""
from typing import Optional
import re

class SimpleTranslator:
    def __init__(self):
        """Khởi tạo translator với từ điển Việt-Anh cơ bản"""
        # Dịch triệu chứng từ tiếng Việt -> tiếng Anh cơ bản
        self.vi_to_en = {
            # Triệu chứng thường gặp
            "ho": "cough",
            "sốt": "fever",
            "đau": "pain",
            "đau đầu": "headache",
            "đau bụng": "abdominal pain",
            "đau ngực": "chest pain",
            "đau tim": "chest pain",
            "khó thở": "difficulty breathing",
            "thở khó": "difficulty breathing",
            "chóng mặt": "dizziness",
            "buồn nôn": "nausea",
            "nôn": "vomiting",
            "nôn máu": "vomiting blood",
            "tiêu chảy": "diarrhea",
            "táo bón": "constipation",
            "mệt mỏi": "fatigue",
            "yếu": "weakness",
            "sưng": "swelling",
            "phát ban": "rash",
            "ngứa": "itching",
            "ho ra máu": "coughing blood",
            "khó nuốt": "difficulty swallowing",
            "đau họng": "sore throat",
            "sổ mũi": "runny nose",
            "nghẹt mũi": "stuffy nose",
            "hắt hơi": "sneezing",
            "đau lưng": "back pain",
            "đau cơ": "muscle pain",
            "đau khớp": "joint pain",
            "tim đập nhanh": "rapid heartbeat",
            "run": "tremor",
            "co giật": "seizure",
            "mất ý thức": "loss of consciousness",
            "chảy máu": "bleeding",
            "sưng phù": "edema",
            "da vàng": "jaundice",
            # Bộ phận cơ thể
            "đầu": "head",
            "ngực": "chest",
            "tim": "heart",
            "bụng": "abdomen",
            "dạ dày": "stomach",
            "lưng": "back",
            "chân": "leg",
            "tay": "arm",
            "họng": "throat",
            # Mức độ
            "cao": "high",
            "nhẹ": "mild",
            "nặng": "severe",
            "dữ dội": "severe",
            "kéo dài": "prolonged",
            "thường xuyên": "frequent",
            "liên tục": "continuous"
        }
        
        # Tiếng Anh -> Tiếng Việt (ánh xạ ngược)
        self.en_to_vi = {v: k for k, v in self.vi_to_en.items()}
        
        print("[OK] SimpleTranslator đã khởi tạo với từ điển cơ bản")
    
    def detect_language(self, text: str) -> str:
        """
        Phát hiện text là tiếng Việt hay tiếng Anh
        Trả về: "vi" hoặc "en"
        """
        if not text:
            return "en"
            
        # Kiểm tra ký tự tiếng Việt
        vietnamese_chars = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ'
        vietnamese_chars += vietnamese_chars.upper()
        
        for char in text:
            if char in vietnamese_chars:
                return "vi"
        
        # Kiểm tra từ tiếng Việt phổ biến (cho text không có dấu)
        text_lower = text.lower()
        vietnamese_words = [
            'toi', 'la', 'co', 'khong', 'va', 'cua', 'trong', 'nay', 'nhu', 'den',
            'dau', 'nguc', 'kho', 'tho', 'bung', 'tim', 'moi', 'chan', 'tay',
            'ho', 'sot', 'met', 'chong', 'mat', 'buon', 'non', 'tieu', 'chay',
            'sung', 'phat', 'ban', 'ngua', 'nuot', 'hong', 'mui', 'hat', 'hoi',
            'lung', 'khop', 'dap', 'nhanh', 'run', 'giat', 'mau', 'vang'
        ]
        
        words = text_lower.split()
        vietnamese_word_count = sum(1 for word in words if word in vietnamese_words)
        
        # Nếu hơn 30% số từ là tiếng Việt, coi như là tiếng Việt
        if len(words) > 0 and vietnamese_word_count / len(words) > 0.3:
            return "vi"
        
        return "en"
    
    def translate_vi_to_en(self, text: str) -> str:
        """
        Dịch text tiếng Việt sang tiếng Anh
        Sử dụng dịch dựa trên từ điển đơn giản
        """
        if not text:
            return text
        
        text_lower = text.lower().strip()
        
        # Thử khớp chính xác trước
        if text_lower in self.vi_to_en:
            return self.vi_to_en[text_lower]
        
        # Thử khớp cụm từ (dài nhất trước)
        translated_parts = []
        words = text_lower.split()
        i = 0
        
        while i < len(words):
            matched = False
            
            # Thử khớp cụm từ có độ dài giảm dần
            for length in range(min(5, len(words) - i), 0, -1):
                phrase = ' '.join(words[i:i+length])
                if phrase in self.vi_to_en:
                    translated_parts.append(self.vi_to_en[phrase])
                    i += length
                    matched = True
                    break
            
            if not matched:
                # Giữ nguyên từ gốc nếu không tìm thấy bản dịch
                translated_parts.append(words[i])
                i += 1
        
        result = ' '.join(translated_parts)
        print(f"[TRANSLATE] '{text}' -> '{result}'")
        return result
    
    def translate_en_to_vi(self, text: str) -> str:
        """
        Dịch text tiếng Anh sang tiếng Việt
        Sử dụng dịch dựa trên từ điển đơn giản
        """
        if not text:
            return text
        
        text_lower = text.lower().strip()
        
        # Thử khớp chính xác
        if text_lower in self.en_to_vi:
            return self.en_to_vi[text_lower]
        
        # Thử dịch từng từ
        words = text_lower.split()
        translated_words = [
            self.en_to_vi.get(word, word) for word in words
        ]
        
        return ' '.join(translated_words)
    
    def translate(self, text: str, target_lang: str = "en") -> str:
        """
        Tự động phát hiện và dịch text
        
        Args:
            text: Text đầu vào
            target_lang: "en" hoặc "vi"
        
        Trả về:
            Text đã dịch
        """
        detected_lang = self.detect_language(text)
        
        if detected_lang == "vi" and target_lang == "en":
            return self.translate_vi_to_en(text)
        elif detected_lang == "en" and target_lang == "vi":
            return self.translate_en_to_vi(text)
        else:
            return text  # Đã ở ngôn ngữ đích

# Instance singleton
translator = SimpleTranslator()
