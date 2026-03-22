import React, { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1600&h=900&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleStartTest = () => {
    window.location.href = '/diagnostic';
  };

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          height: 500px;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
        }

        .hero-slide.active {
          opacity: 1;
        }

        .hero-slide.inactive {
          opacity: 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5), transparent);
          z-index: 1;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
        }

        .hero-content {
          max-width: 48rem;
          color: white;
          text-align: center;
          animation: fadeIn 1s ease-out;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          animation: slideUp 0.8s ease-out;
        }

        .hero-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .hero-button {
          display: inline-block;
          padding: 1rem 2rem;
          background: linear-gradient(to right, #06b6d4, #2563eb);
          color: white;
          text-decoration: none;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: scale(1);
          transition: all 0.3s ease;
          animation: slideUp 0.8s ease-out 0.4s backwards;
          cursor: pointer;
        }

        .hero-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 40px rgba(6, 182, 212, 0.5);
        }

        .slide-indicators {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.75rem;
          z-index: 20;
        }

        .slide-indicator {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slide-indicator.active {
          background-color: white;
          width: 2rem;
        }

        .slide-indicator:hover {
          background-color: rgba(255, 255, 255, 0.75);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }
        }
      `}</style>

      <header className="hero-section">
        {/* Slideshow Images */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : 'inactive'}`}
            style={{
              backgroundImage: `url(${slide})`,
              backgroundPosition: index === 4 ? 'center top' : 'center'
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <h1>Early Detection & Management for Parkinson's Disease</h1>
            <p>
              A non-invasive, web-based tool to screen for Parkinson's disease
              using voice, drawings, and questionnaires.
            </p>
            <button onClick={handleStartTest} className="hero-button">
              Start Diagnostic Test
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </header>
    </>
  );
};

export default HeroSection;