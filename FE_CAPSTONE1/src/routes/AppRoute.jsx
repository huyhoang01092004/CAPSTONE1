import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Booking from "../pages/Booking";
import DepartmentDetails from "../pages/DepartmentDetails";
import Doctors from "../pages/Doctors";
import DoctorDetails from "../pages/DoctorDetails";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Appointments from "../pages/Appointments";

// ✅ Component auto scroll lên đầu khi đổi route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoute = () => {
  return (
    <>
      <ScrollToTop /> {/* thêm vào đây */}
      <Routes>
        {/* Trang chủ -> redirect sang /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/department/:id" element={<DepartmentDetails />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/appointments" element={<Appointments />} />

        {/* fallback 404 */}
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
      </Routes>
    </>
  );
};

export default AppRoute;
