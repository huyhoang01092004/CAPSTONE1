import React from "react";
import Hero from "../components/Home/Hero"; // ✅ vì Hero.jsx nằm cùng thư mục
import Departments from "../components/Home/Departments"; // ✅ vì Departments.jsx cũng nằm cùng thư mục

const Home = () => {
  return (
    <div>
      <Hero />
      <Departments />
    </div>
  );
};

export default Home;
