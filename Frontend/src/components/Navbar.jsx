// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBrain, FaHome, FaStethoscope, FaDrawPolygon, FaMicrophone, FaInfoCircle, FaEnvelope, FaUserCircle, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, openAuthModal, openEditProfileModal } = useAuth();
  const profileMenuRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };


  const isActive = (path) => location.pathname === path;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
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


  const allMenuItems = [
    { path: "/", icon: <FaHome />, label: "Home", roles: ['all'] },
    { path: "/about-us", icon: <FaInfoCircle />, label: "About Us", roles: ['all'] },
    { path: "/diagnostic", icon: <FaStethoscope />, label: "Diagnostic", roles: ['doctor'] },
    { path: "/spiral-test", icon: <FaDrawPolygon />, label: "Spiral Test", roles: ['doctor', 'patient'] },
    { path: "/voice-analysis", icon: <FaMicrophone />, label: "Voice Analysis", roles: ['doctor', 'patient'] },
    { path: "/contact-us", icon: <FaEnvelope />, label: "Contact Us", roles: ['all'] },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.roles.includes('all')) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

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

            {/* Auth Button */}
            <div className="navbar-auth-desktop">
              {user ? (
                <div className="nav-profile-container" ref={profileMenuRef}>
                  <button 
                    className="nav-profile-trigger" 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    title={user.name}
                  >
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="nav-profile-pic" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="nav-profile-placeholder">
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle size={24} />}
                      </div>
                    )}
                    <span className="nav-profile-name">{user.name}</span>
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="nav-profile-dropdown">
                      <div className="nav-profile-header">
                        <span className="nav-profile-dropdown-name">{user.name}</span>
                        <span className="nav-profile-dropdown-role">{user.role}</span>
                      </div>
                      <div className="nav-profile-menu-items">
                        <button 
                          onClick={() => { openEditProfileModal(); setProfileMenuOpen(false); }} 
                          className="nav-profile-menu-btn"
                        >
                          <FaUserEdit /> Edit Profile
                        </button>
                        <button 
                          onClick={() => { logout(); setProfileMenuOpen(false); }} 
                          className="nav-profile-logout-btn"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={openAuthModal}
                  className="btn-auth btn-auth-primary"
                >
                  <FaUserCircle /> Login
                </button>
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
            
            {/* Mobile Auth Button */}
            <li className="mobile-auth-container">
              {user ? (
                <button 
                  onClick={() => { logout(); closeMenu(); }}
                  className="btn-mobile-auth btn-mobile-auth-outline"
                >
                  <FaSignOutAlt /> Logout ({user.name})
                </button>
              ) : (
                <button 
                  onClick={() => { openAuthModal(); closeMenu(); }}
                  className="btn-mobile-auth btn-mobile-auth-primary"
                >
                  <FaUserCircle /> Login / Register
                </button>
              )}
            </li>
          </ul>

          <div className="mobile-menu-footer">
            
            <div className="mobile-menu-copyright">
              © {new Date().getFullYear()} ParkinSense. All rights reserved.
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .navbar-auth-desktop {
          display: none;
          margin-left: 16px;
        }
        @media (min-width: 768px) {
          .navbar-auth-desktop {
            display: flex;
          }
        }
        .btn-auth {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .btn-auth-primary {
          background: linear-gradient(to right, #6366f1, #9333ea);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-auth-primary:hover {
          background: linear-gradient(to right, #4f46e5, #7e22ce);
        }
        .btn-auth-outline {
          background: white;
          color: #4f46e5;
          border: 1px solid #4f46e5;
        }
        .btn-auth-outline:hover {
          background: #e0e7ff;
        }
        
        .mobile-auth-container {
          margin-top: 16px;
          border-top: 1px solid #f3f4f6;
          padding-top: 16px;
        }
        .btn-mobile-auth {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .btn-mobile-auth-primary {
          background: linear-gradient(to right, #6366f1, #9333ea);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-mobile-auth-outline {
          background: #f3f4f6;
          color: #374151;
        }

        /* Profile Dropdown Styles */
        .nav-profile-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(to right, #6366f1, #9333ea);
          color: white;
          border: 1px solid transparent;
          padding: 6px 14px 6px 6px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .nav-profile-trigger:hover {
          background: linear-gradient(to right, #4f46e5, #7e22ce);
          border-color: transparent;
          transform: translateY(-1px);
        }

        .nav-profile-pic, .nav-profile-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .nav-profile-placeholder {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .nav-profile-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
        }

        .nav-profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          min-width: 200px;
          overflow: hidden;
          z-index: 50;
          animation: fade-in-down 0.2s ease-out;
        }

        .nav-profile-header {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
        }

        .nav-profile-dropdown-name {
          font-weight: 700;
          color: #111827;
          font-size: 0.95rem;
        }

        .nav-profile-dropdown-role {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: capitalize;
          margin-top: 2px;
        }

        .nav-profile-menu-btn, .nav-profile-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border: none;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .nav-profile-menu-btn {
          color: #1e293b;
        }

        .nav-profile-menu-btn:hover {
          background: #f1f5f9;
        }

        .nav-profile-logout-btn {
          color: #ef4444;
          border-top: 1px solid #f3f4f6;
        }

        .nav-profile-logout-btn:hover {
          background: #fef2f2;
        }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;