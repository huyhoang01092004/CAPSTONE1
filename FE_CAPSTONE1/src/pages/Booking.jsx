import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Heart,
  Brain,
  Stethoscope,
  Ear,
  Baby,
  Bone,
} from "lucide-react";
const Booking = () => {
  // State for form data
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState("yes");
  const [hasInsurance, setHasInsurance] = useState("yes");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [showDepartmentInfo, setShowDepartmentInfo] = useState(null);
  // Mock data for departments and doctors
  const departments = [
    {
      id: "tim-mach",
      name: "Tim Mạch",
      icon: <Heart className="h-6 w-6 text-green-600" />,
      description:
        "Chuyên khám và điều trị các bệnh lý về tim mạch, huyết áp, và mạch máu.",
    },
    {
      id: "than-kinh",
      name: "Thần Kinh",
      icon: <Brain className="h-6 w-6 text-green-600" />,
      description:
        "Chuyên khám và điều trị các bệnh lý liên quan đến hệ thần kinh trung ương và ngoại biên.",
    },
    {
      id: "noi-khoa",
      name: "Nội Khoa",
      icon: <Stethoscope className="h-6 w-6 text-green-600" />,
      description:
        "Chăm sóc bệnh nhân với các vấn đề về tiêu hóa, hô hấp, thận, nội tiết, và các bệnh lý nội khoa khác.",
    },
    {
      id: "tai-mui-hong",
      name: "Tai Mũi Họng",
      icon: <Ear className="h-6 w-6 text-green-600" />,
      description:
        "Chuyên điều trị các bệnh lý liên quan đến tai, mũi, họng và đầu cổ.",
    },
    {
      id: "nhi-khoa",
      name: "Nhi Khoa",
      icon: <Baby className="h-6 w-6 text-green-600" />,
      description:
        "Cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho trẻ sơ sinh, trẻ em và thanh thiếu niên.",
    },
    {
      id: "chinh-hinh",
      name: "Chỉnh Hình",
      icon: <Bone className="h-6 w-6 text-green-600" />,
      description:
        "Chuyên điều trị các bệnh lý và chấn thương của hệ thống cơ xương khớp.",
    },
  ];
  const doctors = {
    "Tim Mạch": [
      {
        id: "nguyen-van-an",
        name: "Bs. Nguyễn Văn An",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        id: "hoang-van-em",
        name: "Bs. Hoàng Văn Em",
        image:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    ],
    "Thần Kinh": [
      {
        id: "tran-thi-binh",
        name: "Bs. Trần Thị Bình",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        id: "vu-van-khoa",
        name: "Bs. Vũ Văn Khoa",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        id: "mai-thi-lan",
        name: "Bs. Mai Thị Lan",
        image:
          "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    ],
    "Nội Khoa": [
      {
        id: "pham-thi-dung",
        name: "Bs. Phạm Thị Dung",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    ],
    "Tai Mũi Họng": [
      {
        id: "ngo-thi-phuong",
        name: "Bs. Ngô Thị Phương",
        image:
          "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        id: "do-van-giang",
        name: "Bs. Đỗ Văn Giang",
        image:
          "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      },
      {
        id: "ly-thi-huong",
        name: "Bs. Lý Thị Hương",
        image:
          "https://images.unsplash.com/photo-1614608682850-e0d6ed316d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      },
    ],
    "Nhi Khoa": [
      {
        id: "le-minh-cuong",
        name: "Bs. Lê Minh Cường",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    ],
    "Chỉnh Hình": [
      {
        id: "truong-van-minh",
        name: "Bs. Trương Văn Minh",
        image:
          "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        id: "dinh-thi-ngoc",
        name: "Bs. Đinh Thị Ngọc",
        image:
          "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    ],
  };
  const commonSymptoms = [
    "Đau đầu",
    "Sốt",
    "Ho",
    "Đau họng",
    "Khó thở",
    "Chóng mặt",
    "Buồn nôn",
    "Mệt mỏi",
    "Đau bụng",
    "Đau ngực",
    "Đau lưng",
    "Đau khớp",
    "Phát ban",
    "Sưng tấy",
    "Chảy máu",
    "Tiêu chảy",
    "Táo bón",
    "Mất ngủ",
    "Rối loạn tiêu hóa",
  ];
  const insuranceProviders = [
    "Bảo hiểm Y tế Quốc gia",
    "Bảo Việt",
    "Prudential",
    "AIA",
    "Manulife",
    "Dai-ichi Life",
    "Liberty",
    "PJICO",
    "PTI",
    "Khác",
  ];
  // Cập nhật các khung giờ khả dụng khi người dùng chọn bác sĩ và ngày
  useEffect(() => {
    if (doctor && date) {
      // Mô phỏng việc lấy các khung giờ khả dụng từ API
      const generateTimeSlots = () => {
        const morningSlots = ["08:00", "09:00", "10:00", "11:00"];
        const afternoonSlots = ["13:00", "14:00", "15:00", "16:00", "17:00"];
        // Mô phỏng một số khung giờ đã được đặt (không khả dụng)
        const bookedSlots = [];
        const dayOfWeek = new Date(date).getDay();
        if (dayOfWeek === 1 || dayOfWeek === 3) {
          // Thứ 2 hoặc thứ 4
          bookedSlots.push("09:00", "14:00");
        } else if (dayOfWeek === 2 || dayOfWeek === 4) {
          // Thứ 3 hoặc thứ 5
          bookedSlots.push("10:00", "15:00");
        } else if (dayOfWeek === 5) {
          // Thứ 6
          bookedSlots.push("11:00", "16:00");
        }
        // Kết hợp các khung giờ sáng và chiều, loại bỏ các khung giờ đã đặt
        const allSlots = [...morningSlots, ...afternoonSlots];
        return allSlots.filter((slot) => !bookedSlots.includes(slot));
      };
      setAvailableTimeSlots(generateTimeSlots());
    } else {
      setAvailableTimeSlots([]);
    }
  }, [doctor, date]);
  // Add symptom to the list
  const addSymptom = () => {
    if (symptomInput && !symptoms.includes(symptomInput)) {
      setSymptoms([...symptoms, symptomInput]);
      setSymptomInput("");
    }
  };
  // Remove symptom from the list
  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove));
  };
  // Add common symptom to the list
  const addCommonSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };
  // Toggle department info
  const toggleDepartmentInfo = (deptId) => {
    if (showDepartmentInfo === deptId) {
      setShowDepartmentInfo(null);
    } else {
      setShowDepartmentInfo(deptId);
    }
  };
  // Go to next step
  const nextStep = () => {
    if (step === 1 && !department) {
      alert("Vui lòng chọn khoa");
      return;
    }
    if (step === 2 && !doctor) {
      alert("Vui lòng chọn bác sĩ");
      return;
    }
    if (step === 3 && (!date || !timeSlot)) {
      alert("Vui lòng chọn ngày và giờ khám");
      return;
    }
    setStep(step + 1);
  };
  // Go to previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  // Get today's date in YYYY-MM-DD format for min date in date picker
  const today = new Date().toISOString().split("T")[0];
  // Calculate the date 30 days from now for max date in date picker
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const maxDate = thirtyDaysFromNow.toISOString().split("T")[0];
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log({
        department,
        doctor,
        date,
        timeSlot,
        patientName,
        patientPhone,
        patientEmail,
        patientAge,
        patientGender,
        reasonForVisit,
        isFirstVisit,
        hasInsurance,
        insuranceProvider,
        symptoms,
      });
      setIsSubmitting(false);
      setBookingSuccess(true);
      // Scroll to top
      window.scrollTo(0, 0);
    }, 1500);
  };
  // Find selected doctor object
  const selectedDoctor = doctor
    ? doctors[department]?.find((doc) => doc.id === doctor)
    : null;
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="flex items-center text-green-600 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Quay lại trang chủ
          </Link>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Đặt Lịch Khám Bệnh
              </h1>
              <p className="text-green-100">
                Hoàn thành biểu mẫu dưới đây để đặt lịch hẹn với bác sĩ chuyên
                khoa của chúng tôi
              </p>
            </div>
          </div>
        </div>
        {/* Success Message */}
        {bookingSuccess && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đặt Lịch Thành Công!
              </h2>
              <p className="text-gray-600 mb-4">
                Cảm ơn bạn đã đặt lịch khám với {selectedDoctor?.name} vào ngày{" "}
                {date} lúc {timeSlot}.
              </p>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi xác nhận đến email và số điện thoại của bạn.
                Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                  Về Trang Chủ
                </Link>
                <button
                  onClick={() => {
                    setBookingSuccess(false);
                    setStep(1);
                    setDepartment("");
                    setDoctor("");
                    setDate("");
                    setTimeSlot("");
                    setPatientName("");
                    setPatientPhone("");
                    setPatientEmail("");
                    setPatientAge("");
                    setPatientGender("");
                    setReasonForVisit("");
                    setIsFirstVisit("yes");
                    setHasInsurance("yes");
                    setInsuranceProvider("");
                    setSymptoms([]);
                  }}
                  className="px-6 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition duration-300"
                >
                  Đặt Lịch Mới
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Booking Form */}
        {!bookingSuccess && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Progress Steps */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex justify-between items-center relative">
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                <div
                  className={`flex flex-col items-center relative z-10 ${
                    step >= 1 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 1
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm mt-1 font-medium">Chọn Khoa</span>
                </div>
                <div
                  className={`flex flex-col items-center relative z-10 ${
                    step >= 2 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 2
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm mt-1 font-medium">Chọn Bác Sĩ</span>
                </div>
                <div
                  className={`flex flex-col items-center relative z-10 ${
                    step >= 3 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 3
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm mt-1 font-medium">Chọn Lịch</span>
                </div>
                <div
                  className={`flex flex-col items-center relative z-10 ${
                    step >= 4 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 4
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    4
                  </div>
                  <span className="text-sm mt-1 font-medium">Thông Tin</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Choose Department */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Chọn Khoa Khám Bệnh
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng chọn khoa phù hợp với nhu cầu khám bệnh của bạn
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {departments.map((dept) => (
                      <div key={dept.id} className="relative">
                        <input
                          type="radio"
                          id={dept.id}
                          name="department"
                          value={dept.name}
                          checked={department === dept.name}
                          onChange={() => setDepartment(dept.name)}
                          className="hidden"
                        />
                        <label
                          htmlFor={dept.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            department === dept.name
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <div className="mr-3">{dept.icon}</div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-800">
                              {dept.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-green-600"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDepartmentInfo(dept.id);
                            }}
                          >
                            {showDepartmentInfo === dept.id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </label>
                        {showDepartmentInfo === dept.id && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            {dept.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Step 2: Choose Doctor */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Chọn Bác Sĩ
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng chọn bác sĩ bạn muốn khám tại Khoa {department}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {doctors[department]?.map((doc) => (
                      <div key={doc.id}>
                        <input
                          type="radio"
                          id={doc.id}
                          name="doctor"
                          value={doc.id}
                          checked={doctor === doc.id}
                          onChange={() => setDoctor(doc.id)}
                          className="hidden"
                        />
                        <label
                          htmlFor={doc.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            doctor === doc.id
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                            <img
                              src={doc.image}
                              alt={doc.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {doc.name}
                            </h3>
                            <p className="text-sm text-green-600">
                              Khoa {department}
                            </p>
                            <Link
                              to={`/doctor/${doc.id}`}
                              className="text-xs text-blue-500 hover:underline"
                            >
                              Xem thông tin chi tiết
                            </Link>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Step 3: Choose Date and Time */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Chọn Ngày và Giờ Khám
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng chọn ngày và giờ phù hợp để khám với{" "}
                    {
                      doctors[department]?.find((doc) => doc.id === doctor)
                        ?.name
                    }
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Chọn Ngày <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                          min={today}
                          max={maxDate}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                        <Calendar
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={18}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Chọn Giờ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2 border rounded-md pl-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          required
                          disabled={!date}
                        >
                          <option value="">Chọn giờ khám</option>
                          {availableTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <Clock
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={18}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {date && availableTimeSlots.length === 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          Không có lịch trống cho ngày này. Vui lòng chọn ngày
                          khác.
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Schedule Information */}
                  {date && timeSlot && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                      <h3 className="font-medium text-green-800 mb-2">
                        Thông tin lịch hẹn:
                      </h3>
                      <ul className="text-green-700">
                        <li className="flex items-center mb-1">
                          <User size={16} className="mr-2" />
                          Bác sĩ:{" "}
                          {
                            doctors[department]?.find(
                              (doc) => doc.id === doctor
                            )?.name
                          }
                        </li>
                        <li className="flex items-center mb-1">
                          <Calendar size={16} className="mr-2" />
                          Ngày:{" "}
                          {new Date(date).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </li>
                        <li className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          Giờ: {timeSlot}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {/* Step 4: Patient Information */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Thông Tin Bệnh Nhân
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng cung cấp thông tin chính xác để chúng tôi có thể
                    phục vụ bạn tốt nhất
                  </p>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Thông tin cá nhân
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Nguyễn Văn A"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              required
                            />
                            <User
                              className="absolute left-3 top-2.5 text-gray-400"
                              size={18}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="0912 345 678"
                              value={patientPhone}
                              onChange={(e) => setPatientPhone(e.target.value)}
                              required
                            />
                            <Phone
                              className="absolute left-3 top-2.5 text-gray-400"
                              size={18}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="example@gmail.com"
                              value={patientEmail}
                              onChange={(e) => setPatientEmail(e.target.value)}
                            />
                            <Mail
                              className="absolute left-3 top-2.5 text-gray-400"
                              size={18}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Tuổi <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="120"
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={patientAge}
                              onChange={(e) => setPatientAge(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={patientGender}
                              onChange={(e) => setPatientGender(e.target.value)}
                              required
                            >
                              <option value="">Chọn</option>
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                              <option value="other">Khác</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Medical Information */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Thông tin y tế
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Lý do khám <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <textarea
                              className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                              rows={3}
                              placeholder="Mô tả ngắn gọn về lý do bạn muốn gặp bác sĩ"
                              value={reasonForVisit}
                              onChange={(e) =>
                                setReasonForVisit(e.target.value)
                              }
                              required
                            ></textarea>
                            <FileText
                              className="absolute left-3 top-2.5 text-gray-400"
                              size={18}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Triệu chứng
                          </label>
                          <div className="mb-2">
                            <div className="relative flex">
                              <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập triệu chứng của bạn"
                                value={symptomInput}
                                onChange={(e) =>
                                  setSymptomInput(e.target.value)
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addSymptom();
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                                onClick={addSymptom}
                              >
                                Thêm
                              </button>
                            </div>
                          </div>
                          {/* Common symptoms */}
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 mb-1">
                              Triệu chứng phổ biến:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {commonSymptoms.slice(0, 8).map((symptom) => (
                                <button
                                  key={symptom}
                                  type="button"
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    symptoms.includes(symptom)
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                  onClick={() => {
                                    if (symptoms.includes(symptom)) {
                                      removeSymptom(symptom);
                                    } else {
                                      addCommonSymptom(symptom);
                                    }
                                  }}
                                >
                                  {symptom}
                                </button>
                              ))}
                              <button
                                type="button"
                                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-blue-600 hover:bg-gray-200"
                                onClick={() => {
                                  // Toggle showing more symptoms
                                }}
                              >
                                Xem thêm...
                              </button>
                            </div>
                          </div>
                          {/* Selected symptoms */}
                          {symptoms.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Triệu chứng đã chọn:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {symptoms.map((symptom) => (
                                  <span
                                    key={symptom}
                                    className="inline-flex items-center text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full"
                                  >
                                    {symptom}
                                    <button
                                      type="button"
                                      className="ml-1 text-green-500 hover:text-green-700"
                                      onClick={() => removeSymptom(symptom)}
                                    >
                                      &times;
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Đây có phải là lần đầu tiên bạn khám tại phòng
                              khám chúng tôi?
                            </label>
                            <div className="flex space-x-4 mt-1">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="isFirstVisit"
                                  value="yes"
                                  checked={isFirstVisit === "yes"}
                                  onChange={() => setIsFirstVisit("yes")}
                                  className="text-green-600"
                                />
                                <span className="ml-2 text-gray-700">Có</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="isFirstVisit"
                                  value="no"
                                  checked={isFirstVisit === "no"}
                                  onChange={() => setIsFirstVisit("no")}
                                  className="text-green-600"
                                />
                                <span className="ml-2 text-gray-700">
                                  Không
                                </span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Bạn có bảo hiểm y tế không?
                            </label>
                            <div className="flex space-x-4 mt-1">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="hasInsurance"
                                  value="yes"
                                  checked={hasInsurance === "yes"}
                                  onChange={() => setHasInsurance("yes")}
                                  className="text-green-600"
                                />
                                <span className="ml-2 text-gray-700">Có</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="hasInsurance"
                                  value="no"
                                  checked={hasInsurance === "no"}
                                  onChange={() => setHasInsurance("no")}
                                  className="text-green-600"
                                />
                                <span className="ml-2 text-gray-700">
                                  Không
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {hasInsurance === "yes" && (
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Công ty bảo hiểm
                            </label>
                            <select
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={insuranceProvider}
                              onChange={(e) =>
                                setInsuranceProvider(e.target.value)
                              }
                            >
                              <option value="">Chọn công ty bảo hiểm</option>
                              {insuranceProviders.map((provider) => (
                                <option key={provider} value={provider}>
                                  {provider}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="text-green-600 rounded"
                          required
                        />
                        <span className="ml-2 text-gray-700 text-sm">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            điều khoản và điều kiện
                          </a>{" "}
                          của phòng khám
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-300"
                  >
                    Quay lại
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                  >
                    Tiếp tục
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận đặt lịch"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">Cần hỗ trợ?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Nếu bạn gặp khó khăn trong quá trình đặt lịch hoặc có câu hỏi, hãy
              gọi cho chúng tôi
            </p>
            <p className="text-xl font-bold text-green-600">(024) 1234-5678</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">Giờ làm việc</h3>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li className="flex justify-between">
                <span>Thứ Hai - Thứ Sáu:</span>
                <span>8:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Thứ Bảy:</span>
                <span>8:00 - 16:00</span>
              </li>
              <li className="flex justify-between">
                <span>Chủ Nhật:</span>
                <span>8:00 - 12:00</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">Lưu ý</h3>
            </div>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>Vui lòng đến trước giờ hẹn 15-20 phút để hoàn tất thủ tục</li>
              <li>Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có)</li>
              <li>
                Mang theo hồ sơ bệnh án, kết quả xét nghiệm trước đây (nếu có)
              </li>
              <li>Bạn có thể hủy hoặc đổi lịch hẹn trước 24 giờ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Booking;
