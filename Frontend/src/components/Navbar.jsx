// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaBrain, FaGlobe, FaDrawPolygon } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLang = () => setLangOpen(!langOpen);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

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
          <li className={isActive("/") ? "active" : ""}>
            <Link to="/" onClick={() => setMenuOpen(false)}>{t("home")}</Link>
          </li>

          <li className={isActive("/diagnostic") ? "active" : ""}>
            <Link to="/diagnostic" onClick={() => setMenuOpen(false)}>{t("diagnostic")}</Link>
          </li>

          {/* NEW: Spiral Test Link */}
          <li className={isActive("/spiral-test") ? "active" : ""}>
            <Link to="/spiral-test" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              {t("spiral_test") || "Spiral Test"}
            </Link>
          </li>

          <li className={isActive("/about") ? "active" : ""}>
            <Link to="/about" onClick={() => setMenuOpen(false)}>{t("about")}</Link>
          </li>

          <li className={isActive("/contact") ? "active" : ""}>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>{t("contact")}</Link>
          </li>
        </ul>

        {/* Profile + Language + Hamburger */}
        <div className="navbar-icons">
          {/* Language Selector */}
          <div className="relative">
            <button onClick={toggleLang} className="nav-icon">
              <FaGlobe />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border">
                <button onClick={() => changeLang("en")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">English</button>
                <button onClick={() => changeLang("si")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">සිංහල</button>
                <button onClick={() => changeLang("ta")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">தமிழ்</button>
              </div>
            )}
          </div>

          {/* Profile */}
          <Link to="/profile" title="Profile">
            <FaUserCircle className="nav-icon" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="menu-toggle lg:hidden" onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;