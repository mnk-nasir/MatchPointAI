import React, { useState } from "react";
import logo from "../Asset/logo.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <img src={logo} alt="MatchPoint logo" className="navbar-logo" />
        </div>
        <button
          className={`navbar-toggle${isMenuOpen ? " navbar-toggle-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={`navbar-links${isMenuOpen ? " navbar-links-open" : ""
            }`}
        >
          
          <a href="#features">Home</a>
          <a href="#advantage">Services</a>
          <a 
          href="#testimonials">Pricing</a>
          <a href="#solutions">About us</a>
          <a href="#faqs">Faqs</a>
          <div className="navbar-right-mobile">
            <button className="navbar-cta">Get In Touch</button>
          </div>
        </nav>
        <div className="navbar-right">
          <button className="navbar-cta">Get In Touch</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
