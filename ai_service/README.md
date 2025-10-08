# 🤖 AI Medical Chatbot Service

REST API dịch vụ AI Chatbot y tế sử dụng NLP (spaCy + scispaCy + Underthesea) để phân tích triệu chứng, đề xuất chuyên khoa khám và hỗ trợ đặt lịch hẹn thông minh.

## ✨ Tính Năng Chính

### � Phân Tích Triệu Chứng
- **NLP Processing:** Xử lý ngôn ngữ tự nhiên tiếng Việt và tiếng Anh
- **Symptom Matching:** Khớp triệu chứng với database (385 symptoms)
- **Fuzzy Matching:** Hỗ trợ typo và variations
- **Synonym Support:** 50+ nhóm từ đồng nghĩa y tế

### 🏥 Đề Xuất Chuyên Khoa
- **Weighted Scoring:** Thuật toán tính điểm trọng số
- **523 Mappings:** Ánh xạ triệu chứng-chuyên khoa
- **12 Departments:** Tim Mạch, Hô Hấp, Thần Kinh, Tiêu Hóa, v.v.
- **Confidence Level:** Đánh giá độ tin cậy đề xuất

### ⚡ Phân Loại Mức Độ Khẩn Cấp
- **Emergency (Cấp cứu):** Đau ngực, khó thở, ngất xỉu → Gọi 115
- **Priority (Ưu tiên):** Sốt cao, đau dữ dội → Khám trong ngày
- **Normal (Bình thường):** Ho nhẹ, cảm cúm → Khám trong vài ngày

### 📅 Hỗ Trợ Đặt Lịch
- **Doctor Matching:** Tìm bác sĩ phù hợp với chuyên khoa
- **Slot Availability:** Kiểm tra lịch trống
- **Auto Booking:** Đặt lịch tự động dựa trên đề xuất AI

## 📊 Hiệu Suất

- ✅ **Accuracy:** 60% (12/20 test cases)
- ✅ **Coverage:** 85.5% (329/385 symptoms mapped)
- ✅ **Response Time:** < 2 seconds
- ✅ **Supported Languages:** Vietnamese + English

## 🚀 Cài Đặt

### 1. Yêu Cầu Hệ Thống
- Python 3.9 hoặc cao hơn
- MySQL 8.0+
- 2GB RAM trở lên

### 2. Cài Đặt Dependencies

```bash
cd ai_service
pip install -r requirements.txt
```

### 3. Tải Models NLP

```bash
# English models
python -m spacy download en_core_web_sm
python -m spacy download en_ner_bc5cdr_md
```

### 4. Cấu Hình Database

Tạo file `.env`:

```env
# Server Config
AI_PORT=8000
HOST=0.0.0.0

# Database Config
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinic_management
```

### 5. Khởi Động Server

```bash
# Development mode
uvicorn app:app --reload --port 8000

# Production mode
uvicorn app:app --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại: **http://localhost:8000**

## 📚 API Endpoints

### 🏥 Core Endpoints

#### Phân Tích Triệu Chứng Toàn Diện
```http
POST /analyze-symptoms
Content-Type: application/json

{
  "symptoms": "Ho và sốt cao 3 ngày"
}
```

Response:
```json
{
  "matched_symptoms": [...],
  "icd10_codes": ["R05", "R50"],
  "suggested_departments": [
    {
      "department_id": 2,
      "department_name": "Hô Hấp",
      "confidence_label": "Phù hợp",
      "score": 165.2
    }
  ],
  "urgency": {
    "urgency_level": "priority",
    "urgency_score": 7,
    "recommended_action": "Nên đặt lịch khám TRONG NGÀY"
  }
}
```

#### Khớp Triệu Chứng
```http
POST /match-symptoms
Content-Type: application/json

{
  "symptoms": "đau đầu và chóng mặt"
}
```

#### Đề Xuất Chuyên Khoa
```http
POST /suggest-departments
Content-Type: application/json

{
  "symptom_ids": [1, 5, 12]
}
```

#### Phân Loại Mức Độ Khẩn Cấp
```http
POST /classify-urgency
Content-Type: application/json

{
  "symptoms": "đau ngực dữ dội",
  "icd10_codes": ["I21.9"]
}
```

### 📅 Appointment Endpoints

#### Lấy Lịch Trống
```http
GET /get-available-slots?department_id=2&date=2024-10-15
```

#### Tạo Lịch Hẹn
```http
POST /create-appointment
Content-Type: application/json

{
  "patient_info": {
    "full_name": "Nguyễn Văn A",
    "age": 30,
    "gender": "male",
    "phone": "0901234567"
  },
  "symptoms": "Ho và sốt",
  "slot_id": "1_2024-10-15_08:00:00"
}
```

### 🩺 Doctor Endpoints

```http
GET /doctors?department_id=2
GET /doctors?keyword=tim
```

### 💬 Chat Endpoint

```http
POST /chat-analysis
Content-Type: application/json

{
  "message": "Tôi bị ho và sốt cao 3 ngày rồi"
}
```

### 🔍 Utility Endpoints

```http
GET /health              # Health check
POST /translate          # Dịch Việt-Anh
POST /get-icd10-codes    # Lấy mã ICD-10
```

## 🛠️ Tech Stack

### Framework & Server
- **FastAPI 0.115.5** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### NLP & AI
- **spaCy 3.8.2** - English NLP
- **scispaCy 0.5.5** - Medical text processing
- **Underthesea 8.3.0** - Vietnamese NLP
- **FuzzyWuzzy** - Fuzzy string matching

### Database
- **MySQL Connector 9.1.0** - MySQL database driver

## 🔧 Cấu Trúc Project

```
ai_service/
├── app.py                          # Main FastAPI application
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables
├── README.md                      # Documentation
├── TRANSLATION_COMPLETE.md        # Vietnamese translation log
│
├── config/
│   ├── __init__.py
│   └── database.py                # MySQL connection pool
│
├── models/
│   ├── __init__.py
│   └── schemas.py                 # Pydantic models
│
├── utils/
│   ├── __init__.py
│   ├── nlp_processor.py           # NLP processing engine
│   ├── symptom_matcher.py         # Symptom matching logic
│   ├── urgency_classifier.py      # Urgency classification
│   ├── vietnamese_synonyms.py     # Vietnamese synonyms
│   ├── translator.py              # Language translation
│   ├── patient_manager.py         # Patient CRUD
│   └── appointment_manager.py     # Appointment management
│
├── scripts/
│   ├── fix_all_symptom_names.py   # Fix DB symptom names
│   ├── apply_expanded_rules.py    # Apply medical rules
│   ├── apply_targeted_rules.py    # Apply targeted rules
│   ├── add_common_symptoms.py     # Add common symptoms
│   ├── test_comprehensive.py      # Testing suite
│   └── debug_*.py                 # Debug utilities
│
└── migrations/
    └── *.sql                      # Database migrations
```

## 🎯 Workflow

### Luồng Xử Lý Chat

1. **User Input** → "Tôi bị ho và sốt cao 3 ngày"
2. **NLP Processing** → Tokenization, POS tagging, entity extraction
3. **Symptom Matching** → Khớp với DB symptoms (fuzzy + exact match)
4. **Department Suggestion** → Weighted scoring → "Hô Hấp" (score: 165.2)
5. **Urgency Classification** → "Priority" (khám trong ngày)
6. **Slot Recommendation** → Tìm bác sĩ và lịch trống
7. **Booking Confirmation** → Tạo appointment + gửi thông báo

### Weighted Scoring Algorithm

```python
score = matched_symptom_count * avg_confidence * 100 * coverage_bonus
coverage_bonus = 1.0 + (matched / total_symptoms) * 0.5
```

## � API Documentation

Sau khi khởi động server, truy cập:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🧪 Testing

### Chạy Test Suite

```bash
cd ai_service/scripts
python test_comprehensive.py
```

Kết quả mẫu:
```
✅ Test 1: Huyết áp cao → Tim Mạch (PASS)
✅ Test 2: Đau họng → Tai Mũi Họng (PASS)
...
❌ Test 15: Mắt đỏ → Mắt (FAIL: got Tai Mũi Họng)

Final Score: 12/20 tests passed (60.0%)
```

## 📊 Database Schema

### Bảng Chính

```sql
symptoms (385 rows)
├── symptom_id
├── name (English)
├── name_vi (Vietnamese)
└── icd10_code

symptom_department_mapping (523 rows)
├── symptom_id
├── department_id
├── confidence (0.6-1.0)
└── rule_source

departments (12 rows)
├── department_id
└── name (Tim Mạch, Hô Hấp, ...)

appointments
├── appointment_id
├── patient_id
├── doctor_id
├── scheduled_start
├── status
└── booking_channel ('ai')
```

## 🌍 Ngôn Ngữ

Toàn bộ code comments và documentation đã được dịch sang tiếng Việt:
- ✅ 8 files đã dịch (100%)
- ✅ 800+ dòng comments
- ✅ 30+ methods với docstring tiếng Việt
- ✅ Chi tiết xem: [TRANSLATION_COMPLETE.md](TRANSLATION_COMPLETE.md)

## 🔐 Security

- Environment variables cho sensitive data
- Input validation với Pydantic
- SQL injection prevention
- Rate limiting (recommended for production)

## 📝 Ghi Chú

### Yêu Cầu
- ✅ MySQL server đang chạy
- ✅ Database `clinic_management` đã import
- ✅ Port 8000 còn trống
- ✅ Python 3.9+

### Limitations
- Accuracy hiện tại: 60% (target: 70%)
- Chưa hỗ trợ real-time chat history
- Chưa có caching layer
- Chưa có load balancing

## 🚀 Future Improvements

- [ ] Tăng accuracy lên 70%+
- [ ] Thêm context-aware chat
- [ ] Integration với EMR system
- [ ] Multi-language support (English, Chinese)
- [ ] Voice input support
- [ ] Mobile app integration
- [ ] Redis caching
- [ ] Docker containerization

## 👥 Contributors

- **Huy Hoang** - Full-stack Developer & AI Engineer
- **GitHub:** https://github.com/huyhoang01092004

## 📄 License

MIT License

---

**Made with ❤️ and 🤖 by CAPSTONE1 Team**

---

**Made with ❤️ and 🤖 by CAPSTONE1 Team**
