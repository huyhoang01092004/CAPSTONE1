import React from "react";
import { Routes, Route } from "react-router-dom";
// Import các page
import Hero from "../components/Home/Hero";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
const AppRoute = () => {
  return (
    <Routes>
      {/* Trang chủ */}
      <Route path="/" element={<Hero />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRoute;
