import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import DRiskLanding from "./components/sections/DRiskLanding.jsx";
import FundingApplication from "./pages/funding/FundingApplication";
import Startups from "./pages/Startups.jsx";
import Accelerators from "./pages/Accelerators.jsx";
import Investors from "./pages/Investors.jsx";
import StartupsAndCompanies from "./pages/StartupsAndCompanies.jsx";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app-root min-h-screen bg-mp-bg text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<DRiskLanding />} />
          <Route path="/funding" element={<FundingApplication />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/accelerators" element={<Accelerators />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/startups-and-companies" element={<StartupsAndCompanies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
