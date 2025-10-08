"""
AI Service - Backend Chatbot Y Tế
Ứng Dụng FastAPI
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()

# Import database
from config.database import db

# Import utils
from utils.nlp_processor import nlp_processor
from utils.symptom_matcher import symptom_matcher
from utils.urgency_classifier import urgency_classifier
from utils.patient_manager import patient_manager
from utils.appointment_manager import appointment_manager

# Import models
from models.schemas import (
    SymptomInput,
    ChatRequest,
    ChatResponse,
    PatientInfoInput,
    AppointmentRequest
)

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="Dịch Vụ Chatbot Y Tế AI",
    description="REST API cho chatbot y tế với NLP",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",  # Cổng thay thế Frontend Vite
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models (giữ để tương thích ngược)
class PatientInfo(BaseModel):
    full_name: str
    age: int
    gender: str
    phone: str
    email: Optional[str] = None

# Sự kiện khởi động
@app.on_event("startup")
async def startup_event():
    """Kết nối database khi khởi động"""
    print("Đang khởi động AI Service...")
    db.connect()
    print("AI Service đã sẵn sàng!")

# Sự kiện tắt
@app.on_event("shutdown")
async def shutdown_event():
    """Ngắt kết nối database khi tắt"""
    print("Đang tắt AI Service...")
    db.disconnect()
    print("AI Service đã dừng!")

# Endpoint kiểm tra health
@app.get("/")
async def root():
    """Endpoint kiểm tra health"""
    return {
        "status": "ok",
        "service": "Chatbot Y Tế AI",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Kiểm tra trạng thái service"""
    return {
        "status": "healthy",
        "database": "connected" if db.connection and db.connection.is_connected() else "disconnected"
    }

# Endpoint test
@app.post("/api/chat/test", response_model=ChatResponse)
async def test_chat(symptom: SymptomInput):
    """Endpoint test để kiểm tra kết nối"""
    try:
        return ChatResponse(
            success=True,
            message="AI Service đang hoạt động!",
            data={
                "received_text": symptom.symptom_text,
                "patient_id": symptom.patient_id
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Các Endpoint Xử Lý NLP

@app.post("/api/nlp/process", response_model=ChatResponse)
async def process_text(symptom: SymptomInput):
    """
    Xử lý text triệu chứng bằng NLP
    Trả về: text đã xử lý, từ khóa, entities, tokens
    """
    try:
        result = nlp_processor.process_symptom_text(symptom.symptom_text)
        
        return ChatResponse(
            success=True,
            message="Đã xử lý text thành công",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nlp/match-symptoms", response_model=ChatResponse)
async def match_symptoms(symptom: SymptomInput):
    """
    So khớp triệu chứng với database
    Trả về: các triệu chứng khớp với điểm tin cậy
    """
    try:
        matched = symptom_matcher.match_symptoms(symptom.symptom_text)
        
        return ChatResponse(
            success=True,
            message=f"Tìm thấy {len(matched)} triệu chứng phù hợp",
            data={
                "input_text": symptom.symptom_text,
                "matched_symptoms": matched
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nlp/analyze", response_model=ChatResponse)
async def analyze_symptom(symptom: SymptomInput):
    """
    Phân tích toàn bộ triệu chứng:
    - Xử lý NLP
    - Khớp triệu chứng
    - Lấy mã ICD-10
    - Gợi ý chuyên khoa
    - Phân loại mức độ khẩn cấp
    """
    try:
        # Phân tích text triệu chứng
        analysis = symptom_matcher.analyze_symptom_text(symptom.symptom_text)
        
        # Phân loại mức độ khẩn cấp
        urgency = urgency_classifier.classify_urgency(
            symptom.symptom_text,
            analysis["icd10_codes"]
        )
        
        # Kết hợp kết quả
        result = {
            **analysis,
            "urgency": urgency
        }
        
        return ChatResponse(
            success=True,
            message="Phân tích triệu chứng thành công",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/urgency/classify", response_model=ChatResponse)
async def classify_urgency_endpoint(symptom: SymptomInput):
    """
    Xác định mức độ khẩn cấp
    Trả về: cấp cứu, ưu tiên, hoặc bình thường
    """
    try:
        urgency = urgency_classifier.classify_urgency(symptom.symptom_text)
        
        return ChatResponse(
            success=True,
            message="Đã xác định mức độ khẩn cấp",
            data=urgency
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Các Endpoint Quản Lý Bệnh Nhân & Lịch Hẹn

@app.post("/api/patients/create", response_model=ChatResponse)
async def create_patient(patient_info: PatientInfoInput):
    """
    Tạo bệnh nhân mới
    """
    try:
        patient_id = patient_manager.create_patient(
            user_id=patient_info.user_id or 0,
            full_name=patient_info.full_name,
            age=patient_info.age,
            gender=patient_info.gender,
            phone=patient_info.phone,
            email=patient_info.email
        )
        
        if patient_id:
            return ChatResponse(
                success=True,
                message="Đã tạo bệnh nhân thành công",
                data={"patient_id": patient_id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create patient")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/patients/{patient_id}", response_model=ChatResponse)
async def get_patient(patient_id: int):
    """
    Lấy thông tin bệnh nhân theo ID
    """
    try:
        patient = patient_manager.get_patient_by_id(patient_id)
        
        if patient:
            return ChatResponse(
                success=True,
                message="Đã lấy thông tin bệnh nhân",
                data=patient
            )
        else:
            raise HTTPException(status_code=404, detail="Patient not found")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/appointments/available-slots", response_model=ChatResponse)
async def get_available_slots(department_id: int, doctor_id: Optional[int] = None, 
                              date: Optional[str] = None):
    """
    Lấy danh sách slot trống có thể đặt lịch
    """
    try:
        slots = appointment_manager.get_available_slots(department_id, doctor_id, date)
        
        return ChatResponse(
            success=True,
            message=f"Tìm thấy {len(slots)} slot trống",
            data={"slots": slots}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/appointments/create", response_model=ChatResponse)
async def create_appointment(appointment: AppointmentRequest):
    """
    Tạo lịch hẹn khám bệnh mới
    """
    try:
        appointment_id = appointment_manager.create_appointment(
            patient_id=appointment.patient_id,
            doctor_id=appointment.doctor_id,
            department_id=appointment.department_id,
            scheduled_start=appointment.scheduled_start,
            scheduled_end=appointment.scheduled_end,
            symptoms=appointment.symptoms,
            urgency_level=appointment.urgency_level,
            created_by_user_id=appointment.created_by_user_id
        )
        
        if appointment_id:
            return ChatResponse(
                success=True,
                message="Đã đặt lịch hẹn thành công",
                data={"appointment_id": appointment_id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create appointment")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/appointments/{appointment_id}", response_model=ChatResponse)
async def get_appointment(appointment_id: int):
    """
    Lấy thông tin chi tiết lịch hẹn theo ID
    """
    try:
        appointment = appointment_manager.get_appointment_by_id(appointment_id)
        
        if appointment:
            return ChatResponse(
                success=True,
                message="Đã lấy thông tin lịch hẹn",
                data=appointment
            )
        else:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ENDPOINT CHATBOT CHÍNH - Kết hợp tất cả chức năng

@app.post("/api/chat/analyze-full", response_model=ChatResponse)
async def analyze_full_chatbot(request: ChatRequest):
    """
    Endpoint chatbot chính - Phân tích toàn diện và tạo lịch hẹn nếu cần
    
    Quy trình:
    1. Nhập thông tin bệnh nhân (nếu chưa có)
    2. Phân tích triệu chứng
    3. Xác định mức độ khẩn cấp
    4. Gợi ý chuyên khoa khám
    5. Tìm kiếm lịch khám trống
    6. Tạo lịch hẹn (nếu request_appointment = True)
    """
    try:
        # Bước 1: Xử lý thông tin bệnh nhân
        patient_id = None
        if request.patient_info:
            patient_id = patient_manager.create_patient(
                user_id=request.patient_info.user_id or 0,
                full_name=request.patient_info.full_name,
                age=request.patient_info.age,
                gender=request.patient_info.gender,
                phone=request.patient_info.phone,
                email=request.patient_info.email
            )
        
        # Bước 2: Phân tích triệu chứng
        analysis = symptom_matcher.analyze_symptom_text(request.symptom_text)
        
        # Bước 3: Phân loại mức độ khẩn cấp
        urgency = urgency_classifier.classify_urgency(
            request.symptom_text,
            analysis["icd10_codes"]
        )
        
        # Bước 4: Lấy danh sách chuyên khoa gợi ý
        departments = analysis["suggested_departments"]
        
        # Bước 5: Truy vấn các slot trống
        available_slots = []
        if departments and len(departments) > 0:
            top_department = departments[0]
            slots = appointment_manager.get_available_slots(
                department_id=top_department["department_id"],
                date=request.preferred_date
            )
            available_slots = slots[:5]  # 5 slot đầu tiên
        
        # Bước 6: Tạo lịch hẹn nếu được yêu cầu
        appointment_id = None
        if request.request_appointment and patient_id and available_slots:
            first_slot = available_slots[0]
            appointment_id = appointment_manager.create_appointment(
                patient_id=patient_id,
                doctor_id=first_slot["doctor_id"],
                appointment_date=first_slot["date"],
                symptoms=request.symptom_text,
                urgency_level=urgency["urgency_level"]
            )
            
            # Lưu gợi ý từ AI
            if appointment_id and departments:
                appointment_manager.save_ai_recommendation(
                    appointment_id=appointment_id,
                    input_text=request.symptom_text,
                    icd10_codes=analysis["icd10_codes"],
                    symptoms=[s["symptom_name"] for s in analysis["matched_symptoms"]],
                    department_id=departments[0]["department_id"],
                    urgency=urgency["urgency_level"],
                    confidence=departments[0]["confidence"] if departments else 0.0
                )
        
        # Xây dựng response
        result = {
            "patient_id": patient_id,
            "analysis": {
                "input_text": request.symptom_text,
                "language": analysis["processed"]["language"],
                "matched_symptoms": analysis["matched_symptoms"][:5],
                "icd10_codes": analysis["icd10_codes"],
                "suggested_departments": departments[:3],
                "urgency": urgency
            },
            "available_slots": available_slots,
            "appointment_id": appointment_id
        }
        
        return ChatResponse(
            success=True,
            message="Phân tích hoàn tất",
            data=result
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
