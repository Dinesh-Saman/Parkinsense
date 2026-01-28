import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const testimonials = [
    {
      name: "Dr. Nimal Senanayake",
      role: "Senior Neurologist, National Hospital of Sri Lanka",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "ParkinSense represents a paradigm shift in early Parkinson's detection. The AI-powered screening tools provide remarkable accuracy while remaining completely non-invasive and accessible to all patients.",
      rating: 5,
    },
    {
      name: "Nimali Jayawardena",
      role: "Patient, Kandy",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      text: "The voice test was incredibly simple to use. Within minutes, I had results that encouraged me to seek professional help. Early detection saved my quality of life.",
      rating: 5,
    },
    {
      name: "Dr. Ruwan Fernando",
      role: "AI Researcher, University of Colombo",
      image: "https://randomuser.me/api/portraits/men/40.jpg",
      text: "An exemplary fusion of artificial intelligence and healthcare. ParkinSense showcases the transformative potential of machine learning in neurological screening.",
      rating: 5,
    },
    {
      name: "Sanduni Perera",
      role: "Caregiver, Galle",
      image: "https://randomuser.me/api/portraits/women/62.jpg",
      text: "As someone caring for my father with Parkinson's, I wish we had this technology earlier. It empowers families to recognize symptoms before they become severe.",
      rating: 5,
    },
    {
      name: "Dr. Chaminda Rajapaksa",
      role: "Neurologist, Teaching Hospital Karapitiya",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "The spiral drawing analysis is particularly impressive. It captures subtle motor control issues that often go unnoticed in traditional screenings. A game-changer for rural healthcare.",
      rating: 5,
    },
    {
      name: "Priyanka Dissanayake",
      role: "Hospital Staff, Anuradhapura Teaching Hospital",
      image: "https://randomuser.me/api/portraits/women/38.jpg",
      text: "ParkinSense has streamlined our screening process dramatically. We can now assess more patients efficiently, and the digital records help with long-term monitoring.",
      rating: 5,
    },
    {
      name: "Kasun Wickramasinghe",
      role: "Patient, Jaffna",
      image: "https://randomuser.me/api/portraits/men/48.jpg",
      text: "Living in a remote area, access to specialists was always challenging. ParkinSense gave me the initial screening I needed from home, and now I'm receiving proper treatment.",
      rating: 5,
    },
    {
      name: "Dr. Ayesha Fonseka",
      role: "Movement Disorder Specialist, Lanka Hospitals",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
      text: "The multi-modal approach combining voice, drawing, and cognitive tests provides a comprehensive assessment. I recommend ParkinSense to all my at-risk patients.",
      rating: 5,
    },
    {
      name: "Sunil Amarasinghe",
      role: "Caregiver & Former Engineer, Negombo",
      image: "https://randomuser.me/api/portraits/men/60.jpg",
      text: "The technology is user-friendly even for seniors. My wife completed all tests independently, and the clear results helped us have an informed discussion with her neurologist.",
      rating: 5,
    },
    {
      name: "Nurse Dilani Kumaratunga",
      role: "Neurology Ward Supervisor, Colombo General Hospital",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      text: "We've integrated ParkinSense into our preliminary screening protocol. It significantly reduces wait times and helps us prioritize patients who need immediate specialist attention.",
      rating: 5,
    },
  ];

  // Update number of visible items based on screen width
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto carousel
  useEffect(() => {
    const autoPlay = setInterval(() => {
      if (currentIndex >= maxIndex) {
        setDirection("next");
        setIsAnimating(true);
        setCurrentIndex(0);
      } else {
        setDirection("next");
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 5000);

    return () => clearInterval(autoPlay);
  }, [currentIndex, maxIndex]);

  const handleNext = () => {
    if (currentIndex < maxIndex && !isAnimating) {
      setDirection("next");
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
    } else if (currentIndex >= maxIndex && !isAnimating) {
      // Loop back to start
      setDirection("next");
      setIsAnimating(true);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setDirection("prev");
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
    } else if (currentIndex === 0 && !isAnimating) {
      // Loop to end
      setDirection("prev");
      setIsAnimating(true);
      setCurrentIndex(maxIndex);
    }
  };

  const handleDotClick = (index) => {
    if (!isAnimating && index !== currentIndex) {
      setDirection(index > currentIndex ? "next" : "prev");
      setIsAnimating(true);
      setCurrentIndex(index);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      // Swipe left - next
      handleNext();
    } else {
      // Swipe right - previous
      handlePrev();
    }
    
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <>
      <style>{`
        .testimonials-section {
          position: relative;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #ddd6fe 50%, #fce7f3 75%, #fff1f2 100%);
          padding: 5rem 1.5rem;
          overflow: hidden;
        }

        .testimonials-bg-effects {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: pulse 12s ease-in-out infinite;
        }

        .bg-blob-1 {
          top: 10%;
          left: 5%;
          width: 35vw;
          height: 35vw;
          background: rgba(147, 197, 253, 0.25);
        }

        .bg-blob-2 {
          bottom: 15%;
          right: 5%;
          width: 40vw;
          height: 40vw;
          background: rgba(196, 181, 253, 0.25);
          animation-delay: 3s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }

        .testimonials-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .testimonials-header h2 {
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0;
        }

        .testimonials-gradient-text {
          background: linear-gradient(to right, #7c3aed, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .testimonials-subtitle {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #475569;
          margin-top: 1.25rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .carousel-container {
          position: relative;
          padding: 0 3.5rem;
          width: 100%;
          overflow: hidden; /* Add overflow hidden to prevent cut-off */
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(124,58,237,0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .carousel-nav:hover:not(.disabled) {
          background: white;
          border-color: #7c3aed;
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 8px 25px rgba(124,58,237,0.25);
        }

        .carousel-nav.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .carousel-nav-prev { left: 0; }
        .carousel-nav-next { right: 0; }

        .carousel-track-container {
          overflow: visible;
          padding: 1rem 0;
          touch-action: pan-y;
          width: 100%;
          margin: 0 -0.5rem; /* Negative margin to compensate for slide padding */
        }

        .carousel-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
          width: 100%;
        }

        .testimonial-slide {
          flex: 0 0 100%;
          min-width: 100%;
          box-sizing: border-box;
          padding: 0 0.5rem;
        }

        .testimonial-card-enhanced {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(124,58,237,0.12);
          border-radius: 1.5rem;
          padding: 2rem;
          height: 100%;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          width: 100%;
          margin: 0 auto;
        }

        .testimonial-card-enhanced:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(124,58,237,0.15);
          border-color: rgba(124,58,237,0.3);
        }

        .card-gradient-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #7c3aed, #ec4899, #3b82f6);
        }

        .quote-icon {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          opacity: 0.08;
          color: #7c3aed;
        }

        .testimonial-image-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .testimonial-image-container {
          width: 90px;
          height: 90px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(124,58,237,0.15);
          transition: all 0.3s ease;
        }

        .testimonial-card-enhanced:hover .testimonial-image-container {
          border-color: #7c3aed80;
          transform: scale(1.08);
        }

        .testimonial-image-enhanced {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .testimonial-rating {
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #7c3aed;
          color: white;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-size: 0.9rem;
          display: flex;
          gap: 3px;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        .star {
          color: #fcd34d;
        }

        .testimonial-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .testimonial-text-enhanced {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.4rem;
        }

        .testimonial-role-enhanced {
          color: #7c3aed;
          font-size: 0.9rem;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(124,58,237,0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot:hover {
          background: rgba(124,58,237,0.6);
        }

        .dot-active {
          width: 40px;
          background: linear-gradient(to right, #7c3aed, #ec4899);
          border-radius: 999px;
        }

        /* Desktop specific styles - FIXED */
        @media (min-width: 1024px) {
          .testimonial-slide {
            flex: 0 0 calc(100% / 3);
            min-width: calc(100% / 3);
          }
          
          .carousel-track {
            gap: 1.5rem;
          }
          
          .carousel-dots {
            display: none; /* Hide dots on desktop */
          }
          
          /* Adjust container for proper spacing */
          .carousel-track-container {
            margin: 0 -0.75rem;
          }
          
          .testimonial-slide {
            padding: 0 0.75rem;
          }
        }

        /* Tablet styles - FIXED */
        @media (min-width: 768px) and (max-width: 1023px) {
          .testimonial-slide {
            flex: 0 0 50%;
            min-width: 50%;
          }
          
          .carousel-track {
            gap: 1.5rem;
          }
          
          /* Adjust container for proper spacing */
          .carousel-track-container {
            margin: 0 -0.75rem;
          }
          
          .testimonial-slide {
            padding: 0 0.75rem;
          }
        }

        /* Mobile adjustments */
        @media (max-width: 767px) {
          .testimonials-section { 
            padding: 3rem 0.5rem;
          }
          
          .carousel-container { 
            padding: 0 1.5rem;
          }
          
          .carousel-nav {
            width: 44px;
            height: 44px;
          }
          
          .carousel-track {
            gap: 0;
          }
          
          .testimonial-card-enhanced {
            padding: 1.5rem;
            border-radius: 1.25rem;
          }
          
          .testimonial-image-container { 
            width: 80px; 
            height: 80px; 
          }
          
          .testimonial-text-enhanced { 
            font-size: 0.95rem; 
            line-height: 1.6;
          }
          
          .testimonial-name { 
            font-size: 1.15rem; 
          }
          
          .carousel-dots { 
            gap: 6px; 
            margin-top: 2rem; 
          }
          
          .dot { 
            width: 8px; 
            height: 8px; 
          }
          
          .dot-active { 
            width: 24px; 
          }
          
          /* Adjust for mobile */
          .carousel-track-container {
            margin: 0 -0.5rem;
          }
          
          .testimonial-slide {
            padding: 0 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .testimonials-header h2 { 
            font-size: 1.8rem; 
          }
          
          .testimonials-subtitle { 
            font-size: 0.95rem; 
            padding: 0 0.5rem;
          }
          
          .carousel-nav { 
            width: 40px; 
            height: 40px; 
          }
          
          .carousel-container { 
            padding: 0 1rem; 
          }
          
          .testimonial-card-enhanced {
            padding: 1.25rem;
          }
          
          .testimonial-text-enhanced { 
            font-size: 0.9rem; 
          }
          
          .testimonial-name { 
            font-size: 1.1rem; 
          }
          
          .testimonial-role-enhanced { 
            font-size: 0.85rem; 
          }
          
          .dot { 
            width: 6px; 
            height: 6px; 
          }
          
          .dot-active { 
            width: 20px; 
          }
        }

        @media (max-width: 360px) {
          .carousel-container { 
            padding: 0 0.75rem; 
          }
          
          .carousel-nav { 
            width: 36px; 
            height: 36px; 
          }
          
          .testimonial-card-enhanced {
            padding: 1rem;
          }
          
          .carousel-track-container {
            margin: 0 -0.25rem;
          }
          
          .testimonial-slide {
            padding: 0 0.25rem;
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
              className={`carousel-nav carousel-nav-prev`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className={`carousel-nav carousel-nav-next`}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              className="carousel-track-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  transition: isAnimating
                    ? "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
                    : "none",
                }}
              >
                {testimonials.map((item, index) => (
                  <div key={index} className="testimonial-slide">
                    <div className="testimonial-card-enhanced">
                      <div className="card-gradient-top"></div>
                      <Quote className="quote-icon" size={64} />
                      <div className="testimonial-image-wrapper">
                        <div className="testimonial-image-container">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="testimonial-image-enhanced"
                            loading="lazy"
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

            {/* Only show dots on mobile */}
            <div className="carousel-dots">
              {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index * itemsPerView)}
                  className={`dot ${Math.floor(currentIndex / itemsPerView) === index ? "dot-active" : ""}`}
                  aria-label={`Go to testimonial group ${index + 1}`}
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