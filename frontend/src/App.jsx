import React from "react";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-root min-h-screen bg-mp-bg text-white">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;
