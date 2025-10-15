import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaBrain } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <FaBrain className="logo-icon" />
            <span className="logo-text">ParkinSense</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li className={location.pathname === "/diagnostic" ? "active" : ""}>
            <Link to="/diagnostic" onClick={() => setMenuOpen(false)}>Diagnostic</Link>
          </li>
          <li className={location.pathname === "/about" ? "active" : ""}>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          </li>
          <li className={location.pathname === "/contact" ? "active" : ""}>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </li>
        </ul>

        {/* Profile Icon */}
        <div className="navbar-icons">
          <Link to="/profile" title="Profile">
            <FaUserCircle className="nav-icon" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
