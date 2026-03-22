import React, { useState } from "react";
import { 
  Brain, 
  Shield, 
  Users, 
  Target, 
  Award, 
  Heart,
  Globe,
  Clock,
  Zap,
  ChevronRight,
  Star,
  CheckCircle,
  Code,
  Cpu,
  Stethoscope,
  Smartphone,
  Github,
  Linkedin,
  Mail
} from "lucide-react";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("mission");

  // Developer profile section
  const developerProfile = {
    name: "L.D. Pahan Tharaka",
    role: "Lead Developer & Creator",
    image: "https://i.imgur.com/Hjc1nFt.jpeg",
    bio: "Dedicated software developer passionate about healthcare technology and bridging the gap between medicine and digital innovation.",
    description: "As the sole developer behind ParkinSense, I've poured my expertise into creating a platform that revolutionizes Parkinson's disease detection. My journey began with a simple yet powerful vision: to make neurological healthcare accessible to everyone, especially those in rural and underserved communities who lack access to specialized medical facilities.",
    contributions: [
      {
        icon: <Code size={20} />,
        text: "Full-stack development of the entire ParkinSense platform"
      },
      {
        icon: <Cpu size={20} />,
        text: "Integration of AI algorithms for accurate symptom analysis"
      },
      {
        icon: <Stethoscope size={20} />,
        text: "Collaboration with medical professionals for clinical validation"
      },
      {
        icon: <Smartphone size={20} />,
        text: "Mobile-responsive design for accessibility across all devices"
      }
    ],
    missionStatement: "This project represents more than just code—it's a commitment to improving lives through technology. Every line I've written aims to provide non-invasive, early detection that can make a real difference in patient outcomes.",
    socialLinks: [
      { icon: <Github size={20} />, url: "#", label: "GitHub" },
      { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/pahan-tharaka-83711b268/", label: "LinkedIn" },
      { icon: <Mail size={20} />, url: "#", label: "Email" }
    ]
  };

  // ... rest of your existing code for milestones, values, stats ...

  const milestones = [
    { year: "2023", title: "Research & Development", description: "Initial research and prototype development" },
    { year: "2024", title: "Beta Launch", description: "Beta testing with medical professionals" },
    { year: "2025", title: "Public Release", description: "Full public release with AI integration" },
    { year: "2026", title: "Mobile App", description: "Native mobile applications launch" },
    { year: "2027", title: "Global Expansion", description: "International partnerships and deployment" }
  ];

  const values = [
    {
      icon: <Heart size={32} />,
      title: "Compassionate Care",
      description: "We prioritize patient dignity and emotional well-being in every interaction.",
      color: "#ec4899"
    },
    {
      icon: <Shield size={32} />,
      title: "Data Privacy",
      description: "Your health data is encrypted and never shared without consent.",
      color: "#06b6d4"
    },
    {
      icon: <Target size={32} />,
      title: "Clinical Accuracy",
      description: "Rigorous testing and validation with medical professionals.",
      color: "#8b5cf6"
    },
    {
      icon: <Globe size={32} />,
      title: "Accessibility",
      description: "Making Parkinson's screening available to everyone, everywhere.",
      color: "#10b981"
    },
    {
      icon: <Brain size={32} />,
      title: "Innovation",
      description: "Continuous improvement through AI research and user feedback.",
      color: "#f59e0b"
    },
    {
      icon: <Users size={32} />,
      title: "Collaboration",
      description: "Working with healthcare providers for better patient outcomes.",
      color: "#3b82f6"
    }
  ];


  // Handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallbackDiv = e.target.parentNode.querySelector('.developer-image-fallback');
    if (fallbackDiv) {
      fallbackDiv.style.display = 'flex';
    }
  };

  return (
    <>
      <style>{`
        /* Hero Section */
        .about-hero-section {
          position: relative;
          min-height: 500px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          overflow: hidden;
          padding: 6rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=600&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          opacity: 0.2;
        }

        .about-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
        }

        .about-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          text-align: center;
          color: white;
        }

        .about-hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-hero-content p {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }


        /* Mission/Story Section */
        .mission-section {
          padding: 5rem 2rem;
          background: white;
        }

        .mission-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .mission-tab {
          padding: 1rem 2rem;
          background: transparent;
          border: 2px solid #e2e8f0;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mission-tab:hover {
          border-color: #06b6d4;
          color: #06b6d4;
        }

        .mission-tab.active {
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          color: white;
          border-color: transparent;
        }

        .mission-content {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .mission-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1e293b;
        }

        .mission-content p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 2rem;
        }

        /* Developer Profile Section - MODIFIED LAYOUT */
        .developer-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .developer-header-row {
          max-width: 1200px;
          margin: 0 auto 3rem auto;
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .developer-image-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          width: 250px;
          height: 300px;
          flex-shrink: 0;
        }

        .developer-image-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }

        .developer-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .developer-image-fallback {
          display: none;
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 3rem;
        }

        .developer-header-content {
          flex: 1;
        }

        .developer-role {
          display: inline-block;
          background: linear-gradient(135deg, #06b6d4, #443f50);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .developer-name {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .developer-tagline {
          color: #06b6d4;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .developer-bio {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 1.5rem;
        }

        .developer-social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(6, 182, 212, 0.1);
          color: #06b6d4;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: rgba(6, 182, 212, 0.2);
          transform: translateY(-2px);
        }

        .developer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .developer-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 2rem;
        }

        .contributions-list {
          margin: 2rem 0;
        }

        .contribution-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(6, 182, 212, 0.05);
          border-radius: 10px;
          border-left: 4px solid #06b6d4;
        }

        .contribution-icon {
          color: #06b6d4;
        }

        .contribution-text {
          color: #475569;
          font-weight: 500;
        }

        .mission-highlight {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
          padding: 2rem;
          border-radius: 15px;
          border-left: 5px solid #8b5cf6;
          margin-top: 2rem;
        }

        .mission-highlight p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #475569;
          font-style: italic;
          margin: 0;
        }

        /* Values Section */
        .values-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .value-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border-top: 4px solid;
        }

        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .value-icon {
          margin-bottom: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color)20, var(--color)40);
          color: var(--color);
        }

        .value-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1e293b;
        }

        .value-card p {
          color: #64748b;
          line-height: 1.7;
        }

        /* Milestones */
        .milestones-section {
          padding: 5rem 2rem;
          background: white;
        }

        .timeline {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 30px;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
        }

        .milestone-item {
          position: relative;
          padding-left: 80px;
          margin-bottom: 3rem;
        }

        .milestone-year {
          position: absolute;
          left: 0;
          top: 0;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .milestone-content {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .milestone-content h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .milestone-content p {
          color: #64748b;
          line-height: 1.6;
        }

        /* CTA Section */
        .about-cta-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .about-cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent);
        }

        .about-cta-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .about-cta-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-cta-content p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #cbd5e1;
          margin-bottom: 2.5rem;
        }

        .about-cta-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          color: white;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
        }

        .about-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(6, 182, 212, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-hero-content h1 {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 768px) {
          .about-hero-section {
            padding: 4rem 1rem;
          }

          .about-hero-content h1 {
            font-size: 2.2rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .mission-tabs {
            flex-direction: column;
            align-items: center;
          }

          .mission-tab {
            width: 100%;
            max-width: 300px;
          }

          .developer-header-row {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
          }

          .developer-image-container {
            width: 180px;
            height: 180px;
          }

          .developer-name {
            font-size: 2rem;
          }

          .timeline::before {
            left: 20px;
          }

          .milestone-item {
            padding-left: 60px;
          }

        }

        @media (max-width: 480px) {
          .about-hero-content h1 {
            font-size: 1.8rem;
          }

          .mission-content h2,
          .about-cta-content h2 {
            font-size: 2rem;
          }

          .stat-card,
          .value-card {
            padding: 1.5rem;
          }

          .developer-image-container {
            width: 150px;
            height: 150px;
          }

          .developer-name {
            font-size: 1.8rem;
          }

          .developer-social-links {
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        /* Animations */
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

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="about-hero-bg"></div>
          <div className="about-hero-overlay"></div>
          <div className="about-hero-content">
            <h1 className="fade-in-up">Revolutionizing Parkinson's Disease Detection</h1>
            <p className="fade-in-up delay-100">
              At ParkinSense, we're combining cutting-edge artificial intelligence with 
              clinical expertise to provide accessible, accurate, and non-invasive 
              Parkinson's disease screening for everyone.
            </p>
          </div>
        </section>


        {/* Mission/Story Section */}
        <section className="mission-section">
          <div className="mission-tabs">
            <button 
              className={`mission-tab ${activeTab === "mission" ? "active" : ""}`}
              onClick={() => setActiveTab("mission")}
            >
              Our Mission
            </button>
            <button 
              className={`mission-tab ${activeTab === "story" ? "active" : ""}`}
              onClick={() => setActiveTab("story")}
            >
              Our Story
            </button>
            <button 
              className={`mission-tab ${activeTab === "vision" ? "active" : ""}`}
              onClick={() => setActiveTab("vision")}
            >
              Our Vision
            </button>
          </div>

          <div className="mission-content">
            {activeTab === "mission" && (
              <div className="fade-in-up">
                <h2>Empowering Early Detection</h2>
                <p>
                  Our mission is to make Parkinson's disease screening accessible, affordable, 
                  and accurate for everyone. We believe that early detection is the key to 
                  better management and improved quality of life for patients.
                </p>
                <p>
                  By leveraging AI technology, we're breaking down barriers to neurological 
                  healthcare, particularly in underserved communities where access to 
                  specialists is limited.
                </p>
              </div>
            )}

            {activeTab === "story" && (
              <div className="fade-in-up">
                <h2>From Research to Reality</h2>
                <p>
                  ParkinSense began in 2023 as a research collaboration between neurologists 
                  and AI specialists at Sri Lanka's leading medical institutions. Frustrated 
                  by the limitations of traditional screening methods, our founders set out 
                  to create a better solution.
                </p>
                <p>
                  After 18 months of rigorous testing and validation with over 1,000 patients, 
                  we launched our platform - combining voice analysis, motor assessment, and 
                  clinical questionnaires into a single, comprehensive screening tool.
                </p>
              </div>
            )}

            {activeTab === "vision" && (
              <div className="fade-in-up">
                <h2>A Future Without Parkinson's</h2>
                <p>
                  We envision a world where Parkinson's disease is detected at its earliest 
                  stages, allowing for timely intervention and better outcomes. Our vision 
                  extends beyond screening to comprehensive disease management and support.
                </p>
                <p>
                  We're working towards integrating predictive analytics for disease progression 
                  and personalized treatment recommendations, creating a complete ecosystem 
                  for Parkinson's care.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Developer Profile Section - MOVED BEFORE VALUES */}
        <section className="developer-section">
          <div className="fade-in-up">
            {/* Header row with image and name side by side */}
            <div className="developer-header-row">
              <div className="developer-image-container">
                <img 
                  src='https://i.imgur.com/Hjc1nFt.jpeg'
                  alt={developerProfile.name}
                  className="developer-image"
                  onError={handleImageError}
                />
                <div className="developer-image-fallback">
                  {developerProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              <div className="developer-header-content">
                <div className="developer-role">{developerProfile.role}</div>
                <h2 className="developer-name">{developerProfile.name}</h2>
                <div className="developer-tagline">
                  "Bridging Technology and Healthcare for Better Patient Outcomes"
                </div>
                <p className="developer-bio">{developerProfile.bio}</p>
                
                <div className="developer-social-links">
                  {developerProfile.socialLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      className="social-link"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content below */}
            <div className="developer-content">
              <p className="developer-description">
                {developerProfile.description} I combined voice analysis algorithms, 
                motor symptom tracking, and comprehensive clinical questionnaires into 
                a single, user-friendly platform. This holistic approach ensures that 
                even individuals in the most remote areas can access reliable Parkinson's 
                screening without the need for expensive equipment or specialist visits.
              </p>
              
              <div className="contributions-list">
                <h3 style={{color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.3rem'}}>
                  Key Contributions:
                </h3>
                {developerProfile.contributions.map((contribution, index) => (
                  <div key={index} className="contribution-item">
                    <div className="contribution-icon">{contribution.icon}</div>
                    <div className="contribution-text">{contribution.text}</div>
                  </div>
                ))}
              </div>
              
              <div className="mission-highlight">
                <p>
                  <strong>My Vision:</strong> {developerProfile.missionStatement} 
                  By making this technology non-invasive, affordable, and accessible 
                  across rural areas, I aim to empower patients with early knowledge 
                  about their health, enabling timely interventions and improving 
                  quality of life. This platform represents hope—a tool that combines 
                  compassionate care with technological innovation to serve humanity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - MOVED AFTER DEVELOPER SECTION */}
        <section className="values-section">
          <h2 style={{textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#1e293b'}}>
            Our Core Values
          </h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="value-card fade-in-up" 
                style={{
                  '--color': value.color,
                  animationDelay: `${index * 0.1}s`,
                  borderTopColor: value.color
                }}
              >
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="milestones-section">
          <h2 style={{textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#1e293b'}}>
            Our Journey
          </h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-item fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="milestone-year">{milestone.year}</div>
                <div className="milestone-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta-section">
          <div className="about-cta-bg"></div>
          <div className="about-cta-content">
            <h2 className="fade-in-up">Join Us in Making a Difference</h2>
            <p className="fade-in-up delay-100">
              Whether you're a patient, caregiver, or healthcare provider, 
              we invite you to be part of our mission to transform Parkinson's care.
            </p>
            <button 
              onClick={() => window.location.href = '/diagnostic'}
              className="about-cta-button fade-in-up delay-200"
            >
              Start Your Screening Journey
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;