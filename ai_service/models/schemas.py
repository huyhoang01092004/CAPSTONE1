"""
Pydantic Models for API requests/responses
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, time

# Patient Models
class PatientInfoInput(BaseModel):
    user_id: Optional[int] = None
    full_name: str
    age: int = Field(gt=0, lt=150)
    gender: str
    phone: str
    email: Optional[str] = None

class PatientResponse(BaseModel):
    patient_id: int
    user_id: Optional[int]
    full_name: Optional[str]
    phone: str
    email: Optional[str]

# Symptom Models
class SymptomInput(BaseModel):
    patient_id: Optional[int] = None
    patient_info: Optional[PatientInfoInput] = None
    symptom_text: str

class SymptomMatch(BaseModel):
    symptom_id: int
    symptom_name: str
    match_type: str
    confidence: int
    icd10_code: str

# Appointment Models
class AppointmentRequest(BaseModel):
    patient_id: int
    doctor_id: int
    department_id: int
    scheduled_start: str  # YYYY-MM-DD HH:MM:SS
    scheduled_end: str    # YYYY-MM-DD HH:MM:SS
    symptoms: str
    urgency_level: Optional[str] = "normal"
    created_by_user_id: Optional[int] = None

class AppointmentResponse(BaseModel):
    appointment_id: int
    patient_id: int
    doctor_id: int
    appointment_date: str
    status: str
    reason: str

# Chat Models
class ChatRequest(BaseModel):
    patient_info: Optional[PatientInfoInput] = None
    symptom_text: str
    request_appointment: bool = False
    preferred_date: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

# Department Models
class DepartmentInfo(BaseModel):
    department_id: int
    department_name: str
    confidence: float

# Urgency Models
class UrgencyInfo(BaseModel):
    urgency_level: str
    urgency_score: int
    matched_keywords: List[str]
    reason: str
    recommended_action: str

# Full Analysis Response
class FullAnalysisResponse(BaseModel):
    input_text: str
    language: str
    matched_symptoms: List[SymptomMatch]
    icd10_codes: List[str]
    suggested_departments: List[DepartmentInfo]
    urgency: UrgencyInfo
    available_slots: Optional[List[Dict]] = None
