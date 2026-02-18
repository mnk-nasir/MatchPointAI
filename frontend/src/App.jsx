import React from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Hero from "./components/sections/Hero.jsx";
import "./styles/App.css";

function App() {
  return (
    <div className="app-root min-h-screen bg-mp-bg text-white">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;
