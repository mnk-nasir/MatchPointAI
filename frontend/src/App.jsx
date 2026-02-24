import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Hero from "./components/sections/Hero.jsx";
import FundingApplication from "./pages/funding/FundingApplication";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app-root min-h-screen bg-mp-bg text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/funding" element={<FundingApplication />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
