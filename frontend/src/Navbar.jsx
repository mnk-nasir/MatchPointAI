import React from "react";
import logo from "../Asset/logo.png";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <img src={logo} alt="MatchPoint logo" className="navbar-logo" />
          {/* <span className="navbar-brand">MatchPoint</span> */}
        </div>
        <nav className="navbar-links">
          <a href="#advantage">Our Advantage</a>
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#solutions">Solutions</a>
          <a href="#faqs">Faqs</a>
        </nav>
        <div className="navbar-right">
          <button className="navbar-cta">Get In Touch</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
