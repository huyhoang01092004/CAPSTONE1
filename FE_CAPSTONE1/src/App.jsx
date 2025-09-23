import React, { useState } from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import AIChat from "./components/Home/AiChat";
import AppRouter from "./routes/AppRouter";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app">
      <Header />
      <main className="min-h-screen">
        <AppRouter />
      </main>
      <Footer />
      <AIChat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

export default App;
