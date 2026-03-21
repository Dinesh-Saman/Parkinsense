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
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  
  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`);
  };

  return (
    <>
      <style>{`
        /* Unique animation names to prevent conflicts */
        @keyframes parkinsenseFadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes parkinsenseHeartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Unique footer class names */
        .parkinsense-footer-wrapper {
          width: 100%;
          margin-top: auto;
          position: relative;
        }
        
        .parkinsense-footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
          color: white;
          width: 100%;
          position: relative;
        }
        
        .parkinsense-footer-top-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899, #f59e0b);
        }
        
        .parkinsense-footer-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 100px 40px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr;
          gap: 60px;
          position: relative;
          z-index: 10;
          width: 100%;
          box-sizing: border-box;
          align-items: start;
        }
        
        .parkinsense-footer-section {
          animation: parkinsenseFadeInUp 0.8s ease-out backwards;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .parkinsense-footer-section:nth-child(1) { animation-delay: 0.1s; }
        .parkinsense-footer-section:nth-child(2) { animation-delay: 0.2s; }
        .parkinsense-footer-section:nth-child(3) { animation-delay: 0.3s; }
        
        .parkinsense-logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .parkinsense-logo-icon {
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
        
        .parkinsense-section-title {
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
        
        .parkinsense-section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          border-radius: 2px;
        }
        
        .parkinsense-description {
          color: #cbd5e1;
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 24px;
          flex-grow: 1;
        }
        
        .parkinsense-cta-button {
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
          font-family: inherit;
          align-self: flex-start;
          margin-top: auto;
        }
        
        .parkinsense-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }
        
        .parkinsense-cta-button:hover svg {
          transform: translateX(4px);
        }
        
        .parkinsense-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex-grow: 1;
        }
        
        .parkinsense-link-list li {
          margin-bottom: 14px;
        }
        
        .parkinsense-link-button {
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
          width: 100%;
        }
        
        .parkinsense-link-button::before {
          content: '';
          position: absolute;
          left: 0;
          width: 12px;
          height: 2px;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          transition: width 0.3s ease;
        }
        
        .parkinsense-link-button:hover {
          color: white;
          padding-left: 28px;
        }
        
        .parkinsense-link-button:hover::before {
          width: 20px;
        }
        
        .parkinsense-contact-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .parkinsense-contact-items {
          flex-grow: 1;
        }
        
        .parkinsense-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #cbd5e1;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .parkinsense-contact-item:hover {
          color: white;
          transform: translateX(4px);
        }
        
        .parkinsense-contact-icon {
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
        
        .parkinsense-contact-item:hover .parkinsense-contact-icon {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: scale(1.1);
        }
        
        .parkinsense-social-icons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        
        .parkinsense-social-icon {
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
        
        .parkinsense-social-icon:hover {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }
        
        .parkinsense-footer-divider {
          max-width: 1400px;
          margin: 0 auto;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3), transparent);
          position: relative;
          z-index: 10;
        }
        
        .parkinsense-bottom-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 40px;
          text-align: center;
          position: relative;
          z-index: 10;
          width: 100%;
          box-sizing: border-box;
        }
        
        .parkinsense-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .parkinsense-copyright {
          color: #94a3b8;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .parkinsense-heart-icon {
          color: #ec4899;
          animation: parkinsenseHeartbeat 1.5s ease-in-out infinite;
        }
        
        .parkinsense-bottom-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .parkinsense-bottom-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }
        
        .parkinsense-bottom-link:hover {
          color: #a78bfa;
        }
        
        .parkinsense-disclaimer {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 16px 24px;
          color: #cbd5e1;
          font-size: 0.8rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        
        .parkinsense-disclaimer strong {
          color: #fbbf24;
        }
        
        /* Desktop-specific styles for margins */
        .parkinsense-quick-links-section {
          margin-left: 50px;
        }
        
        .parkinsense-contact-section {
          margin-left: 80px;
        }
        
        /* Mobile Responsive Styles */
        
        /* Tablet (968px and below) */
        @media (max-width: 968px) {
          .parkinsense-footer-main {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 60px 30px 30px;
          }
          
          .parkinsense-bottom-section {
            padding: 24px 30px;
          }
          
          .parkinsense-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
          .parkinsense-bottom-links {
            justify-content: center;
          }
          
          .parkinsense-footer-section {
            height: auto;
            min-height: auto;
          }
          
          /* Remove desktop margins on mobile */
          .parkinsense-quick-links-section {
            margin-left: 0 !important;
          }
          
          .parkinsense-contact-section {
            margin-left: 0 !important;
          }
          
          /* Center ParkinSense logo and title on mobile */
          .parkinsense-logo-section {
            flex-direction: column;
            align-items: center !important;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .parkinsense-logo-icon {
            margin-bottom: 10px;
          }
          
          .parkinsense-section-title {
            text-align: center;
            display: block;
          }
          
          .parkinsense-section-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .parkinsense-description {
            text-align: center;
          }
          
          .parkinsense-cta-button {
            align-self: center;
          }
        }
        
        /* Small Tablet (768px and below) */
        @media (max-width: 768px) {
          .parkinsense-footer-main {
            padding: 50px 25px 25px;
            gap: 35px;
          }
          
          .parkinsense-section-title {
            font-size: 1.35rem;
          }
          
          .parkinsense-logo-icon {
            width: 42px;
            height: 42px;
            font-size: 1.3rem;
          }
        }
        
        /* Mobile (640px and below) */
        @media (max-width: 640px) {
          .parkinsense-footer-main {
            padding: 40px 20px 20px;
            gap: 30px;
          }
          
          .parkinsense-section-title {
            font-size: 1.25rem;
          }
          
          .parkinsense-social-icon {
            width: 40px;
            height: 40px;
          }
          
          .parkinsense-bottom-section {
            padding: 20px;
          }
          
          .parkinsense-disclaimer {
            padding: 12px 16px;
            font-size: 0.75rem;
          }
          
          .parkinsense-bottom-links {
            gap: 16px;
            justify-content: center;
          }
          
          .parkinsense-contact-icon {
            width: 32px;
            height: 32px;
            min-width: 32px;
          }
          
          .parkinsense-cta-button {
            padding: 10px 20px;
            font-size: 0.85rem;
          }
          
          .parkinsense-description {
            font-size: 0.9rem;
          }
          
          .parkinsense-link-button {
            font-size: 0.9rem;
          }
          
          .parkinsense-contact-item {
            font-size: 0.9rem;
          }
          
          .parkinsense-social-icons {
            justify-content: center;
          }
        }
        
        /* Small Mobile (480px and below) */
        @media (max-width: 480px) {
          .parkinsense-footer-main {
            padding: 30px 16px 16px;
            gap: 25px;
          }
          
          .parkinsense-logo-section {
            gap: 8px;
          }
          
          .parkinsense-section-title {
            font-size: 1.15rem;
          }
          
          .parkinsense-copyright {
            font-size: 0.8rem;
          }
          
          .parkinsense-bottom-link {
            font-size: 0.8rem;
          }
          
          .parkinsense-link-button {
            justify-content: center;
            padding-left: 0;
          }
          
          .parkinsense-link-button::before {
            display: none;
          }
        }
        
        /* Extra Small Mobile (360px and below) */
        @media (max-width: 360px) {
          .parkinsense-footer-main {
            padding: 25px 12px 12px;
          }
          
          .parkinsense-bottom-section {
            padding: 16px 12px;
          }
          
          .parkinsense-disclaimer {
            padding: 10px 12px;
            font-size: 0.7rem;
          }
          
          .parkinsense-social-icons {
            gap: 8px;
          }
          
          .parkinsense-social-icon {
            width: 36px;
            height: 36px;
          }
          
          .parkinsense-cta-button {
            padding: 8px 16px;
            font-size: 0.8rem;
          }
          
          .parkinsense-logo-icon {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
          
          .parkinsense-contact-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 8px;
          }
          
          .parkinsense-contact-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }
        }
      `}</style>

      <div className="parkinsense-footer-wrapper">
        <footer className="parkinsense-footer">
          <div className="parkinsense-footer-top-border"></div>
          
          <div className="parkinsense-footer-main">
            {/* About Section */}
            <div className="parkinsense-footer-section">
              <div className="parkinsense-logo-section">
                <div className="parkinsense-logo-icon">PS</div>
                <h3 className="parkinsense-section-title">ParkinSense</h3>
              </div>
              <p className="parkinsense-description">
                Empowering early detection of Parkinson's Disease with non-invasive,
                web-based tools. Your health, our priority.
              </p>
            </div>

            {/* Quick Links Section */}
            <div className="parkinsense-footer-section parkinsense-quick-links-section">
              <h3 className="parkinsense-section-title">Quick Links</h3>
              <ul className="parkinsense-link-list">
                <li>
                  <button className="parkinsense-link-button" onClick={() => handleNavigation('/')}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="parkinsense-link-button" onClick={() => handleNavigation('/about-us')}>
                    About
                  </button>
                </li>
                <li>
                  <button className="parkinsense-link-button" onClick={() => handleNavigation('/contact-us')}>
                    Contact
                  </button>
                </li>

                {/* Role-based Dynamic Links */}
                {user && (
                 <>
                  <li>
                    <button className="parkinsense-link-button" onClick={() => handleNavigation('/spiral-test')}>
                      Spiral Test
                    </button>
                  </li>
                  <li>
                    <button className="parkinsense-link-button" onClick={() => handleNavigation('/voice-analysis')}>
                      Voice Analysis
                    </button>
                  </li>
                 </>
                )}
                
                {user?.role === 'doctor' && (
                  <li>
                    <button className="parkinsense-link-button" onClick={() => handleNavigation('/diagnostic')}>
                      Diagnostic
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="parkinsense-footer-section parkinsense-contact-section">
              <div className="parkinsense-contact-content">
                <h3 className="parkinsense-section-title">Contact Us</h3>
                <div className="parkinsense-contact-items">
                  <div className="parkinsense-contact-item">
                    <div className="parkinsense-contact-icon"><MapPin size={18} /></div>
                    <span>No.98 Anandha Mawatha Kuliyapitiya</span>
                  </div>
                  <div className="parkinsense-contact-item">
                    <div className="parkinsense-contact-icon"><Phone size={18} /></div>
                    <span>+94 77 123 4567</span>
                  </div>
                  <div className="parkinsense-contact-item">
                    <div className="parkinsense-contact-icon"><Mail size={18} /></div>
                    <span>parkinsense.info@gmail.com</span>
                  </div>
                </div>
                <div className="parkinsense-social-icons">
                  <a href="#" aria-label="Facebook" className="parkinsense-social-icon">
                    <Facebook size={20} />
                  </a>
                  <a href="#" aria-label="Twitter" className="parkinsense-social-icon">
                    <Twitter size={20} />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="parkinsense-social-icon">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="parkinsense-footer-divider"></div>

          <div className="parkinsense-bottom-section">
            <div className="parkinsense-bottom-content">
              <p className="parkinsense-copyright">
                © 2025 ParkinSense. Made with <Heart className="parkinsense-heart-icon" size={14} fill="#ec4899" /> in Sri Lanka
              </p>
              <div className="parkinsense-bottom-links">
                <a href="#" className="parkinsense-bottom-link">Privacy Policy</a>
                <a href="#" className="parkinsense-bottom-link">Terms of Service</a>
                <a href="#" className="parkinsense-bottom-link">Cookie Policy</a>
              </div>
            </div>

            <div className="parkinsense-disclaimer">
              <strong>Medical Disclaimer:</strong> This tool is for screening purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for diagnosis.
              <br /><br />
              <strong>MDS-UPDRS © 2008 International Parkinson and Movement Disorder Society. Stage prediction based on Goetz et al. (2015). For clinical use only.</strong>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;