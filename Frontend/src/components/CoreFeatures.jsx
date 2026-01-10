import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CoreFeatures = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const features = [
    {
      image: "https://images.unsplash.com/photo-1589254065909-b7086229d08c?w=400&h=400&fit=crop",
      title: "Voice Biomarker Analysis",
      description: "Analyze voice for tremor, tone variation, and articulation issues using AI-based pattern detection.",
      color: "#06b6d4"
    },
    {
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=400&fit=crop",
      title: "Spiral Drawing Assessment",
      description: "Detect tremors and micrographia through advanced image interpretation of your spiral drawings.",
      color: "#8b5cf6"
    },
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
      title: "MDS-UPDRS Questionnaire",
      description: "Estimate disease stage with a clinically validated questionnaire assessing motor and non-motor symptoms.",
      color: "#ec4899"
    },
    {
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop",
      title: "Personalized Recommendations",
      description: "Get specialized doctor and hospital suggestions based on your condition and location.",
      color: "#f59e0b"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...new Set([...prev, index])]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = (index) => {
    if (index === 1) {
      navigate("/spiral-test");
    } else if (index === 2) {
      navigate("/diagnostic");
    }
  };

  return (
    <>
      <style>{`
        .services-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
          overflow: hidden;
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s ease-in-out infinite;
        }

        .services-section::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 15s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 50px) scale(1.1);
          }
        }

        .services-section h2 {
          text-align: center;
          font-size: 2.75rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
        }

        .section-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #64748b;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .service-card {
          background: white;
          border-radius: 20px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
        }

        .service-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .icon-wrapper {
          width: 100%;
          height: 200px;
          margin: 0 0 1.5rem 0;
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .icon-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .service-card:hover .icon-wrapper::after {
          opacity: 1;
        }

        .icon-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .service-card:hover .icon-wrapper {
          transform: scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .service-card:hover .icon-wrapper img {
          transform: scale(1.1);
        }

        .service-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          padding: 0 1.5rem;
          color: #1e293b;
          text-align: center;
          transition: color 0.3s ease;
        }

        .service-card:hover h3 {
          color: var(--card-color);
        }

        .service-card p {
          font-size: 1rem;
          line-height: 1.7;
          padding: 0 1.5rem 2rem;
          color: #64748b;
          text-align: center;
        }

        .feature-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--card-color);
          color: white;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }

        .service-card:hover .feature-badge {
          opacity: 1;
          transform: scale(1);
        }

        /* Make clickable cards look interactive */
        .service-card.clickable {
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .services-section {
            padding: 3rem 1rem;
          }

          .services-section h2 {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 1rem;
            margin-bottom: 2.5rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .service-card {
            padding: 2rem 1.5rem;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <section className="services-section" ref={sectionRef}>
        <h2>Our Core Features</h2>
        <p className="section-subtitle">
          Advanced AI-powered diagnostics for early Parkinson's disease detection
        </p>
        <div className="services-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`service-card ${visibleCards.includes(index) ? 'visible' : ''} ${
                index === 1 || index === 2 ? 'clickable' : ''
              }`}
              style={{
                '--card-color': feature.color,
                '--card-color-light': `${feature.color}33`
              }}
              onClick={() => handleCardClick(index)}
            >
              <span className="feature-badge">AI Powered</span>
              <div className="icon-wrapper">
                <img src={feature.image} alt={feature.title} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CoreFeatures;