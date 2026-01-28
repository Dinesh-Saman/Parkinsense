// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBrain, FaHome, FaStethoscope, FaDrawPolygon, FaMicrophone, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const langDropdownRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const toggleLang = () => setLangOpen(!langOpen);
  
  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.menu-toggle')) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Custom Globe Icon
  const GlobeIcon = () => (
    <svg
      className="globe-icon-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );

  // Menu items with icons
  const menuItems = [
    { path: "/", icon: <FaHome />, label: t("home") },
    { path: "/diagnostic", icon: <FaStethoscope />, label: t("diagnostic") },
    { path: "/spiral-test", icon: <FaDrawPolygon />, label: t("spiral_test") || "Spiral Test" },
    { path: "/voice-analysis", icon: <FaMicrophone />, label: t("voice_analysis") || "Voice Analysis" },
    { path: "/about-us", icon: <FaInfoCircle />, label: t("about") },
    { path: "/contact-us", icon: <FaEnvelope />, label: t("contact") },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <FaBrain className="logo-icon" />
              <span className="logo-text">ParkinSense</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="navbar-links">
            {menuItems.map((item) => (
              <li key={item.path} className={isActive(item.path) ? "active" : ""}>
                <Link to={item.path}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right-side Icons */}
          <div className="navbar-icons">
            {/* Language Selector */}
            <div className="language-selector" ref={langDropdownRef}>
              <button
                onClick={toggleLang}
                className="globe-button"
                aria-label="Change language"
                aria-expanded={langOpen}
                title="Select Language"
              >
                <GlobeIcon />
                <span className="current-lang">{i18n.language.toUpperCase()}</span>
              </button>
              
              {/* Language Popup */}
              {langOpen && (
                <div className="language-popup">
                  <div className="language-options">
                    <button
                      onClick={() => changeLang("en")}
                      className={`language-option ${i18n.language === "en" ? "selected" : ""}`}
                    >
                      <span className="language-flag">🌐</span>
                      <span className="language-details">
                        <span className="language-name">English</span>
                        <span className="language-native">English</span>
                      </span>
                    </button>
                    <button
                      onClick={() => changeLang("si")}
                      className={`language-option ${i18n.language === "si" ? "selected" : ""}`}
                    >
                      <span className="language-flag">🇱🇰</span>
                      <span className="language-details">
                        <span className="language-name">සිංහල</span>
                        <span className="language-native">Sinhala</span>
                      </span>
                    </button>
                    <button
                      onClick={() => changeLang("ta")}
                      className={`language-option ${i18n.language === "ta" ? "selected" : ""}`}
                    >
                      <span className="language-flag">🇮🇳</span>
                      <span className="language-details">
                        <span className="language-name">தமிழ்</span>
                        <span className="language-native">Tamil</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle - Hidden on desktop */}
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? "active" : ""}`} onClick={closeMenu}></div>

      {/* Full Screen Mobile Menu */}
      <div ref={menuRef} className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <FaBrain className="mobile-logo-icon" />
            <span className="mobile-logo-text">ParkinSense</span>
          </div>
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <div className="mobile-menu-content">
          <ul className="mobile-menu-links">
            {menuItems.map((item) => (
              <li key={item.path} className={isActive(item.path) ? "active" : ""}>
                <Link to={item.path} onClick={closeMenu}>
                  <span className="mobile-menu-icon">{item.icon}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                  {isActive(item.path) && <span className="mobile-menu-active-indicator"></span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-menu-footer">
            <div className="mobile-language-selector">
              <h3 className="mobile-language-title">Select Language</h3>
              <div className="mobile-language-options">
                <button
                  onClick={() => changeLang("en")}
                  className={`mobile-language-option ${i18n.language === "en" ? "selected" : ""}`}
                >
                  <span className="mobile-language-flag">🌐</span>
                  <span className="mobile-language-info">
                    <span className="mobile-language-name">English</span>
                    <span className="mobile-language-code">EN</span>
                  </span>
                </button>
                <button
                  onClick={() => changeLang("si")}
                  className={`mobile-language-option ${i18n.language === "si" ? "selected" : ""}`}
                >
                  <span className="mobile-language-flag">🇱🇰</span>
                  <span className="mobile-language-info">
                    <span className="mobile-language-name">සිංහල</span>
                    <span className="mobile-language-code">SI</span>
                  </span>
                </button>
                <button
                  onClick={() => changeLang("ta")}
                  className={`mobile-language-option ${i18n.language === "ta" ? "selected" : ""}`}
                >
                  <span className="mobile-language-flag">🇮🇳</span>
                  <span className="mobile-language-info">
                    <span className="mobile-language-name">தமிழ்</span>
                    <span className="mobile-language-code">TA</span>
                  </span>
                </button>
              </div>
            </div>
            
            <div className="mobile-menu-copyright">
              © {new Date().getFullYear()} ParkinSense. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;