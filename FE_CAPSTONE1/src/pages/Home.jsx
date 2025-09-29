import React from "react";
import Hero from "../components/Home/Hero"; // ✅ vì Hero.jsx nằm cùng thư mục
import Departments from "../components/Home/Departments"; // ✅ vì Departments.jsx cũng nằm cùng thư mục
import QuickBooking from "../components/Home/QuickBooking";

const Home = () => {
  return (
    <div>
      <Hero />
      <QuickBooking />
      <Departments />
    </div>
  );
};

export default Home;
