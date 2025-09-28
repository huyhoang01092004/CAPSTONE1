import React from "react";
import { Routes, Route } from "react-router-dom";
// Import các page
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Booking from "../pages/Booking";
import Doctors from "../pages/Doctors";
import DepartmentDetails from "../pages/DepartmentDetails";
import DoctorDetails from "../pages/DoctorDetails";
const AppRoute = () => {
  return (
    <Routes>
      {/* Trang chủ */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Register" element={<RegisterPage />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/department/:id" element={<DepartmentDetails />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctor/:id" element={<DoctorDetails />} />
    </Routes>
  );
};

export default AppRoute;
