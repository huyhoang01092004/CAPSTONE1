import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Save,
  ArrowLeft,
  Camera,
  Shield,
  Upload,
  X,
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [medicalFiles, setMedicalFiles] = useState([]); // file upload
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      fetchProfile(storedUser.id || id);
    }
  }, [id]);

  // ✅ Fetch API
  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/by-user/${userId}`
      );
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (err) {
      console.error("❌ Lỗi fetch profile:", err);
    }
  };

  // ✅ Validate form
  const validate = () => {
    const newErrors = {};
    if (!profile.full_name?.trim()) newErrors.full_name = "Họ và tên bắt buộc";
    if (!profile.email) newErrors.email = "Email bắt buộc";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      newErrors.email = "Email không hợp lệ";

    if (!profile.phone) newErrors.phone = "Số điện thoại bắt buộc";
    else if (!/^[0-9]{9,11}$/.test(profile.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";

    if (!profile.dob) newErrors.dob = "Ngày sinh bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Upload file kết quả khám
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedicalFiles((prev) => [...prev, ...files]);
  };

  // ✅ Xóa file đã chọn
  const removeFile = (index) => {
    setMedicalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${profile.patient_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("✅ Cập nhật thành công!");
      } else {
        alert("❌ Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi update:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return <div className="p-8">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/" className="flex items-center text-green-600 mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Quay lại trang chủ
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold">Cập Nhật Hồ Sơ</h1>
            <p className="text-green-100 mt-1">
              Cập nhật thông tin cá nhân và hồ sơ y tế của bạn
            </p>
          </div>

          {/* Avatar */}
          <div className="p-6 border-b flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full shadow-md hover:bg-green-700 transition">
                <Camera size={16} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800">
                {profile.full_name}
              </h2>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail size={16} className="mr-2" /> {profile.email}
              </p>
              <p className="text-gray-600 flex items-center">
                <Phone size={16} className="mr-2" /> {profile.phone}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 font-medium ${
                activeTab === "personal"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <User size={18} className="inline mr-2" /> Thông Tin Cá Nhân
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium ${
                activeTab === "medical"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("medical")}
            >
              <FileText size={18} className="inline mr-2" /> Hồ Sơ Y Tế
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium ${
                activeTab === "security"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={18} className="inline mr-2" /> Bảo Mật
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* ========== TAB 1: PERSONAL ========== */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ và tên */}
                  <div>
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="full_name"
                      value={profile.full_name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm">{errors.full_name}</p>
                    )}
                  </div>
                  {/* Email */}
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  {/* Phone */}
                  <div>
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                  {/* DOB */}
                  <div>
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob ? profile.dob.split("T")[0] : ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm">{errors.dob}</p>
                    )}
                  </div>
                  {/* Giới tính */}
                  <div>
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={profile.gender || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Liên hệ khẩn cấp */}
                <div>
                  <h4 className="font-medium mb-3">Người liên hệ khẩn cấp</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="emergency_full_name"
                      value={profile.emergency_full_name || ""}
                      onChange={handleChange}
                      placeholder="Họ và tên"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={profile.emergency_phone || ""}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                      type="text"
                      name="emergency_relationship"
                      value={profile.emergency_relationship || ""}
                      onChange={handleChange}
                      placeholder="Mối quan hệ"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========== TAB 2: MEDICAL ========== */}
            {activeTab === "medical" && (
              <div className="space-y-6">
                <div>
                  <label>Số thẻ bảo hiểm y tế</label>
                  <input
                    type="text"
                    name="insurance_number"
                    value={profile.insurance_number || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label>Nhóm máu</label>
                  <select
                    name="blood_type"
                    value={profile.blood_type || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Chọn nhóm máu</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label>Dị ứng (nếu có)</label>
                  <textarea
                    name="allergies"
                    value={profile.allergies || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  ></textarea>
                </div>
                <div>
                  <label>Tiền sử bệnh lý</label>
                  <textarea
                    name="medical_history"
                    value={profile.medical_history || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  ></textarea>
                </div>
                {/* Upload medical files */}
                <div>
                  <label>Kết quả khám / xét nghiệm trước đây</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full"
                  />
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {medicalFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Kết quả"
                          className="h-24 w-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Bảo Mật Tài Khoản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          current: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          newPass: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirm: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={async () => {
                      // ✅ Validate trước khi gọi API
                      if (
                        !passwords.current ||
                        !passwords.newPass ||
                        !passwords.confirm
                      ) {
                        alert("Vui lòng nhập đầy đủ mật khẩu");
                        return;
                      }
                      if (passwords.newPass.length < 8) {
                        alert("Mật khẩu mới phải có ít nhất 8 ký tự");
                        return;
                      }
                      if (passwords.newPass !== passwords.confirm) {
                        alert("Mật khẩu xác nhận không khớp");
                        return;
                      }

                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          "http://localhost:5000/api/auth/change-password",
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              currentPassword: passwords.current,
                              newPassword: passwords.newPass,
                            }),
                          }
                        );

                        const data = await res.json();

                        if (res.ok && data.success) {
                          alert("✅ Đổi mật khẩu thành công!");
                          setPasswords({
                            current: "",
                            newPass: "",
                            confirm: "",
                          }); // reset form
                        } else {
                          alert(data.message || "❌ Đổi mật khẩu thất bại");
                        }
                      } catch (err) {
                        console.error("❌ Lỗi đổi mật khẩu:", err);
                        alert("Có lỗi xảy ra khi đổi mật khẩu");
                      }
                    }}
                    className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            )}
            {/* Submit */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md font-medium flex items-center ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isSubmitting ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save className="mr-2" size={20} /> Lưu Thay Đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
