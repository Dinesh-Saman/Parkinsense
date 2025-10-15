import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const testimonials = [
    {
      name: "Dr. Nimal Senanayake",
      role: "Senior Neurologist, National Hospital of Sri Lanka",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "ParkinSense represents a paradigm shift in early Parkinson's detection. The AI-powered screening tools provide remarkable accuracy while remaining completely non-invasive and accessible to all patients.",
      rating: 5
    },
    {
      name: "Nimali Jayawardena",
      role: "Patient, Kandy",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      text: "The voice test was incredibly simple to use. Within minutes, I had results that encouraged me to seek professional help. Early detection saved my quality of life.",
      rating: 5
    },
    {
      name: "Dr. Ruwan Fernando",
      role: "AI Researcher, University of Colombo",
      image: "https://randomuser.me/api/portraits/men/40.jpg",
      text: "An exemplary fusion of artificial intelligence and healthcare. ParkinSense showcases the transformative potential of machine learning in neurological screening.",
      rating: 5
    },
    {
      name: "Sanduni Perera",
      role: "Caregiver, Galle",
      image: "https://randomuser.me/api/portraits/women/62.jpg",
      text: "As someone caring for my father with Parkinson's, I wish we had this technology earlier. It empowers families to recognize symptoms before they become severe.",
      rating: 5
    },
    {
      name: "Dr. Chaminda Rajapaksa",
      role: "Neurologist, Teaching Hospital Karapitiya",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "The spiral drawing analysis is particularly impressive. It captures subtle motor control issues that often go unnoticed in traditional screenings. A game-changer for rural healthcare.",
      rating: 5
    },
    {
      name: "Priyanka Dissanayake",
      role: "Hospital Staff, Anuradhapura Teaching Hospital",
      image: "https://randomuser.me/api/portraits/women/38.jpg",
      text: "ParkinSense has streamlined our screening process dramatically. We can now assess more patients efficiently, and the digital records help with long-term monitoring.",
      rating: 5
    },
    {
      name: "Kasun Wickramasinghe",
      role: "Patient, Jaffna",
      image: "https://randomuser.me/api/portraits/men/48.jpg",
      text: "Living in a remote area, access to specialists was always challenging. ParkinSense gave me the initial screening I needed from home, and now I'm receiving proper treatment.",
      rating: 5
    },
    {
      name: "Dr. Ayesha Fonseka",
      role: "Movement Disorder Specialist, Lanka Hospitals",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
      text: "The multi-modal approach combining voice, drawing, and cognitive tests provides a comprehensive assessment. I recommend ParkinSense to all my at-risk patients.",
      rating: 5
    },
    {
      name: "Sunil Amarasinghe",
      role: "Caregiver & Former Engineer, Negombo",
      image: "https://randomuser.me/api/portraits/men/60.jpg",
      text: "The technology is user-friendly even for seniors. My wife completed all tests independently, and the clear results helped us have an informed discussion with her neurologist.",
      rating: 5
    },
    {
      name: "Nurse Dilani Kumaratunga",
      role: "Neurology Ward Supervisor, Colombo General Hospital",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      text: "We've integrated ParkinSense into our preliminary screening protocol. It significantly reduces wait times and helps us prioritize patients who need immediate specialist attention.",
      rating: 5
    }
  ];

  const itemsPerView = window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto carousel
  useEffect(() => {
    const autoPlay = setInterval(() => {
      if (currentIndex >= maxIndex) {
        setDirection('next');
        setIsAnimating(true);
        setCurrentIndex(0);
      } else {
        setDirection('next');
        setIsAnimating(true);
        setCurrentIndex(prev => prev + 1);
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoPlay);
  }, [currentIndex, maxIndex]);

  const handleNext = () => {
    if (currentIndex < maxIndex && !isAnimating) {
      setDirection('next');
      setIsAnimating(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setDirection('prev');
      setIsAnimating(true);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDotClick = (index) => {
    if (!isAnimating && index !== currentIndex) {
      setDirection(index > currentIndex ? 'next' : 'prev');
      setIsAnimating(true);
      setCurrentIndex(index);
    }
  };

  return (
    <>
      <style>{`
        .testimonials-section {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #ddd6fe 50%, #fce7f3 75%, #fff1f2 100%);
          padding: 80px 20px;
          overflow: hidden;
        }

        .testimonials-bg-effects {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: pulse 4s ease-in-out infinite;
        }

        .bg-blob-1 {
          top: 80px;
          left: 40px;
          width: 400px;
          height: 400px;
          background: rgba(147, 197, 253, 0.3);
        }

        .bg-blob-2 {
          bottom: 80px;
          right: 40px;
          width: 500px;
          height: 500px;
          background: rgba(196, 181, 253, 0.3);
          animation-delay: 1s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .testimonials-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 80px;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .testimonials-header h2 {
          font-size: 3.5rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
          line-height: 1.2;
        }

        .testimonials-gradient-text {
          background: linear-gradient(to right, #7c3aed, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-top: 10px !important;
        }

        .testimonials-subtitle {
          font-size: 1.25rem;
          color: #475569;
          margin-top: 20px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .carousel-container {
          position: relative;
          padding: 0 60px;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(124, 58, 237, 0.2);
          padding: 16px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.15);
        }

        .carousel-nav:hover:not(.disabled) {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(124, 58, 237, 0.4);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25);
        }

        .carousel-nav.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .carousel-nav-prev {
          left: 0;
          transform: translate(-16px, -50%);
        }

        .carousel-nav-next {
          right: 0;
          transform: translate(16px, -50%);
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          color: #7c3aed;
        }

        .carousel-track-container {
          overflow: hidden;
          padding: 8px;
        }

        .carousel-track {
          display: flex;
          gap: 24px;
          transition: transform 0.5s ease-out;
        }

        .carousel-track.slide-left {
          animation: slideLeft 0.5s ease-out;
        }

        .carousel-track.slide-right {
          animation: slideRight 0.5s ease-out;
        }

        @keyframes slideLeft {
          from {
            transform: translateX(0);
          }
        }

        @keyframes slideRight {
          from {
            transform: translateX(0);
          }
        }

        .testimonial-slide {
          flex: 0 0 calc(33.333% - 16px);
          min-width: 0;
        }

        .testimonial-card-enhanced {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 20px;
          padding: 40px;
          height: 100%;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.08);
        }

        .testimonial-card-enhanced:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(124, 58, 237, 0.3);
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.15);
        }

        .card-gradient-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, #7c3aed, #ec4899, #3b82f6);
        }

        .quote-icon {
          position: absolute;
          top: 24px;
          right: 24px;
          opacity: 0.08;
          transition: opacity 0.3s ease;
          color: #7c3aed;
        }

        .testimonial-card-enhanced:hover .quote-icon {
          opacity: 0.15;
        }

        .testimonial-image-wrapper {
          position: relative;
          margin-bottom: 30px;
        }

        .testimonial-image-container {
          width: 96px;
          height: 96px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(124, 58, 237, 0.2);
          transition: all 0.3s ease;
        }

        .testimonial-card-enhanced:hover .testimonial-image-container {
          border-color: rgba(124, 58, 237, 0.5);
          transform: scale(1.05);
        }

        .testimonial-image-enhanced {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .testimonial-card-enhanced:hover .testimonial-image-enhanced {
          transform: scale(1.1);
        }

        .testimonial-rating {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #7c3aed;
          padding: 4px 12px;
          border-radius: 20px;
          display: flex;
          gap: 2px;
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);
        }

        .star {
          color: #fcd34d;
          font-size: 0.75rem;
        }

        .testimonial-content {
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .testimonial-text-enhanced {
          color: #475569;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 24px;
          font-style: italic;
        }

        .testimonial-name {
          color: #1e293b;
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .testimonial-role-enhanced {
          color: #7c3aed;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 60px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot:hover {
          background: rgba(124, 58, 237, 0.5);
        }

        .dot-active {
          width: 48px;
          border-radius: 6px;
          background: linear-gradient(to right, #7c3aed, #ec4899);
        }

        .testimonials-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 80px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #64748b;
          font-size: 1rem;
        }

        @media (max-width: 1024px) {
          .testimonial-slide {
            flex: 0 0 calc(50% - 12px);
          }
          
          .testimonials-header h2 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .testimonials-section {
            padding: 60px 15px;
          }

          .testimonial-slide {
            flex: 0 0 100%;
          }
          
          .carousel-container {
            padding: 0 50px;
          }
          
          .testimonials-header h2 {
            font-size: 2rem;
          }
          
          .testimonials-subtitle {
            font-size: 1rem;
          }
          
          .testimonials-stats {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .stat-number {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <section className="testimonials-section">
        <div className="testimonials-bg-effects">
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>
        </div>

        <div className="testimonials-wrapper">
          <div className="testimonials-header">
            <h2>Trusted by Healthcare</h2>
            <h2 className="testimonials-gradient-text">Professionals & Patients</h2>
            <p className="testimonials-subtitle">
              Real stories from doctors, patients, and caregivers across Sri Lanka
            </p>
          </div>

          <div className="carousel-container">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`carousel-nav carousel-nav-prev ${currentIndex === 0 ? 'disabled' : ''}`}
            >
              <ChevronLeft className="nav-icon" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`carousel-nav carousel-nav-next ${currentIndex >= maxIndex ? 'disabled' : ''}`}
            >
              <ChevronRight className="nav-icon" />
            </button>

            <div className="carousel-track-container">
              <div
                className={`carousel-track ${isAnimating ? (direction === 'next' ? 'slide-left' : 'slide-right') : ''}`}
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                }}
              >
                {testimonials.map((item, index) => (
                  <div key={index} className="testimonial-slide">
                    <div className="testimonial-card-enhanced">
                      <div className="card-gradient-top"></div>
                      
                      <div className="quote-icon">
                        <Quote size={64} />
                      </div>

                      <div className="testimonial-image-wrapper">
                        <div className="testimonial-image-container">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="testimonial-image-enhanced"
                          />
                        </div>
                        <div className="testimonial-rating">
                          {[...Array(item.rating)].map((_, i) => (
                            <span key={i} className="star">★</span>
                          ))}
                        </div>
                      </div>

                      <div className="testimonial-content">
                        <p className="testimonial-text-enhanced">"{item.text}"</p>
                        <h3 className="testimonial-name">{item.name}</h3>
                        <p className="testimonial-role-enhanced">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="carousel-dots">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`dot ${index === currentIndex ? 'dot-active' : ''}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Testimonials;