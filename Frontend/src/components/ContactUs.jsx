import React, { useState } from "react";
import { Mail, User, MessageSquare, Send, MapPin, Phone, Clock } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    message: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Data:", formData);
    alert("Thank you! Your message has been submitted.");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: "Location",
      details: "Colombo, Sri Lanka"
    },
    {
      icon: <Phone size={24} />,
      title: "Phone",
      details: "+94 77 478 5555"
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      details: "info@parkinsense.lk"
    },
    {
      icon: <Clock size={24} />,
      title: "Working Hours",
      details: "Mon - Fri: 9AM - 5PM"
    }
  ];

  return (
    <>
      <style>{`
        .contact-us-section {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 25%, #e0e7ff 50%, #f3e8ff 75%, #fae8ff 100%);
          padding: 100px 20px;
          overflow: hidden;
        }

        .contact-bg-circles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .circle-shape {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          animation: float-circle 8s ease-in-out infinite;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: 5%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 15%;
          animation-delay: 4s;
        }

        @keyframes float-circle {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) scale(1.1);
            opacity: 0.5;
          }
        }

        .contact-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInDown 0.8s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact-header h2 {
          font-size: 3.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
        }

        .contact-header p {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: stretch;
        }

        .contact-info-section {
          animation: fadeInLeft 0.8s ease-out;
          display: flex;
          flex-direction: column;
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .contact-info-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .info-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 24px;
        }

        .contact-info-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .contact-info-item:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15);
        }

        .info-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .info-text {
          flex: 1;
        }

        .info-text h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 2px;
        }

        .info-text p {
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 500;
        }

        .contact-form-section {
          animation: fadeInRight 0.8s ease-out;
          display: flex;
          flex-direction: column;
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .contact-form {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .textarea-icon {
          position: absolute;
          left: 16px;
          top: 24px;
          color: #94a3b8;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .form-group.focused .input-icon,
        .form-group.focused .textarea-icon {
          color: #8b5cf6;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 16px 16px 16px 52px;
          border: 2px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          font-size: 1rem;
          color: #1e293b;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          background: white;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: #94a3b8;
        }

        .submit-button {
          width: 100%;
          padding: 16px 32px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #6366f1 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .submit-button:hover::before {
          opacity: 1;
        }

        .submit-button span,
        .submit-button-icon {
          position: relative;
          z-index: 1;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .submit-button:hover .submit-button-icon {
          transform: translateX(4px);
        }

        @media (max-width: 968px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .contact-header h2 {
            font-size: 2.5rem;
          }

          .contact-form {
            padding: 32px;
          }
        }

        @media (max-width: 640px) {
          .contact-us-section {
            padding: 60px 15px;
          }

          .contact-header h2 {
            font-size: 2rem;
          }

          .contact-header p {
            font-size: 1rem;
          }

          .contact-info-card,
          .contact-form {
            padding: 24px;
          }
        }
      `}</style>

      <section className="contact-us-section">
        <div className="contact-bg-circles">
          <div className="circle-shape circle-1"></div>
          <div className="circle-shape circle-2"></div>
          <div className="circle-shape circle-3"></div>
        </div>

        <div className="contact-wrapper">
          <div className="contact-header">
            <h2>Get In Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you. Send us a message!</p>
          </div>

          <div className="contact-content">
            <div className="contact-info-section">
              <div className="contact-info-card">
                <h3 className="info-title">Contact Information</h3>
                <div className="contact-info-items">
                  {contactInfo.map((item, index) => (
                    <div className="contact-info-item" key={index}>
                      <div className="info-icon">
                        {item.icon}
                      </div>
                      <div className="info-text">
                        <h4>{item.title}</h4>
                        <p>{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <div className="contact-form">
                <div className={`form-group ${isFocused.name ? 'focused' : ''}`}>
                  <div className="input-wrapper">
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({...isFocused, name: true})}
                      onBlur={() => setIsFocused({...isFocused, name: false})}
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className={`form-group ${isFocused.email ? 'focused' : ''}`}>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({...isFocused, email: true})}
                      onBlur={() => setIsFocused({...isFocused, email: false})}
                      placeholder="Your Email"
                    />
                  </div>
                </div>

                <div className={`form-group ${isFocused.message ? 'focused' : ''}`}>
                  <div className="input-wrapper">
                    <MessageSquare className="textarea-icon" size={20} />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({...isFocused, message: true})}
                      onBlur={() => setIsFocused({...isFocused, message: false})}
                      placeholder="Your Message"
                      rows="5"
                    ></textarea>
                  </div>
                </div>

                <button type="button" onClick={handleSubmit} className="submit-button">
                  <span>Send Message</span>
                  <Send className="submit-button-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;