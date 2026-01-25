import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`);
    // Use your router: navigate(path)
  };

  return (
    <>
      <style>{`
        .footer {
          position: relative;
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
          color: white;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899, #f59e0b);
        }

        .footer-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 40px 40px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr;
          gap: 60px;
          position: relative;
          z-index: 10;
        }

        .footer-section {
          animation: fadeInUp 0.8s ease-out backwards;
        }

        .footer-section:nth-child(1) { animation-delay: 0.1s; }
        .footer-section:nth-child(2) { animation-delay: 0.2s; }
        .footer-section:nth-child(3) { animation-delay: 0.3s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .footer-section h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          display: inline-block;
        }

        .footer-section h3::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          border-radius: 2px;
        }

        .about-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .about p {
          color: #cbd5e1;
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        .footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
          border: none;
          cursor: pointer;
        }

        .footer-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .footer-cta-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }

        .footer-cta:hover .footer-cta-icon {
          transform: translateX(4px);
        }

        .links ul { list-style: none; padding: 0; margin: 0; }
        .links li { margin-bottom: 14px; }

        .links button {
          background: none;
          border: none;
          color: #cbd5e1;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          padding-left: 20px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }

        .links button::before {
          content: '';
          position: absolute;
          left: 0;
          width: 12px;
          height: 2px;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          transition: width 0.3s ease;
        }

        .links button:hover {
          color: white;
          padding-left: 28px;
        }

        .links button:hover::before { width: 20px; }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #cbd5e1;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          color: white;
          transform: translateX(4px);
        }

        .contact-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a78bfa;
          transition: all 0.3s ease;
        }

        .contact-item:hover .contact-icon {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: scale(1.1);
        }

        .social-icons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .social-icons a {
          width: 44px;
          height: 44px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a78bfa;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-icons a:hover {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .footer-divider {
          max-width: 1400px;
          margin: 0 auto;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3), transparent);
          position: relative;
          z-index: 10;
        }

        .footer-bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 40px;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        .copyright {
          color: #94a3b8;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .heart-icon {
          color: #ec4899;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .footer-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .footer-links a:hover { color: #a78bfa; }

        .disclaimer {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 16px 24px;
          color: #cbd5e1;
          font-size: 0.8rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        .disclaimer strong {
          color: #fbbf24;
        }

        @media (max-width: 968px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 60px 30px 30px;
          }
          .footer-bottom { padding: 24px 30px; }
          .footer-bottom-content { flex-direction: column; text-align: center; }
        }

        @media (max-width: 640px) {
          .footer-container { padding: 40px 20px 20px; }
          .footer-section h3 { font-size: 1.25rem; }
          .social-icons a { width: 40px; height: 40px; }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-bg-pattern"></div>

        <div className="footer-container">
          {/* About */}
          <div className="footer-section about">
            <div className="about-logo">
              <div className="logo-icon">PS</div>
              <h3 style={{ marginBottom: 0 }}>ParkinSense</h3>
            </div>
            <p>
              Empowering early detection of Parkinson's Disease with non-invasive,
              web-based tools. Your health, our priority.
            </p>
            <button onClick={() => handleNavigation('/diagnostic')} className="footer-cta">
              <span>Start Screening</span>
              <ArrowRight className="footer-cta-icon" />
            </button>
          </div>

          {/* Quick Links */}
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><button onClick={() => handleNavigation('/')}>Home</button></li>
              <li><button onClick={() => handleNavigation('/diagnostic')}>Diagnostic</button></li>
              <li><button onClick={() => handleNavigation('/about')}>About</button></li>
              <li><button onClick={() => handleNavigation('/contact')}>Contact</button></li>
              <li><button onClick={() => handleNavigation('/blog')}>Resources</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <div className="contact-icon"><MapPin size={18} /></div>
              <span>Colombo, Sri Lanka</span>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><Phone size={18} /></div>
              <span>+94 77 123 4567</span>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><Mail size={18} /></div>
              <span>info@parkinsense.lk</span>
            </div>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 ParkinSense. Made with <Heart className="heart-icon" size={14} fill="currentColor" /> in Sri Lanka
            </p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>

          {/* MDS-UPDRS Legal Disclaimer (Added Here) */}
          <div className="disclaimer">
            <strong>Medical Disclaimer:</strong> This tool is for screening purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for diagnosis.
            <br /><br />
            <strong>MDS-UPDRS © 2008 International Parkinson and Movement Disorder Society. Stage prediction based on Goetz et al. (2015). For clinical use only.</strong>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;