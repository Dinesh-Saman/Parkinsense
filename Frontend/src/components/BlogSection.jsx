import React, { useState } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const blogs = [
    {
      title: "Understanding Parkinson's Disease",
      description:
        "Learn about the causes, symptoms, and early warning signs of Parkinson's Disease.",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
      link: "/blog/understanding-parkinsons",
      readTime: "5 min read",
      date: "Oct 5, 2024",
      category: "Medical Education"
    },
    {
      title: "Importance of Early Detection",
      description:
        "Early detection can help manage symptoms and improve quality of life for patients.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      link: "/blog/early-detection",
      readTime: "4 min read",
      date: "Oct 3, 2024",
      category: "Prevention"
    },
    {
      title: "Non-Invasive Screening Techniques",
      description:
        "Discover how voice analysis, spiral drawing, and questionnaires help detect Parkinson's.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      link: "/blog/screening-techniques",
      readTime: "6 min read",
      date: "Oct 1, 2024",
      category: "Technology"
    },
  ];

  return (
    <>
      <style>{`
        .blog-section {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fed7aa 50%, #fecaca 75%, #fce7f3 100%);
          padding: 100px 20px;
          overflow: hidden;
        }

        .blog-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
        }

        .blog-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .blog-header {
          text-align: center;
          margin-bottom: 80px;
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

        .blog-header h2 {
          font-size: 3.5rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 16px;
          position: relative;
          display: inline-block;
        }

        .blog-header h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(to right, #f59e0b, #ec4899);
          border-radius: 2px;
        }

        .blog-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin-top: 24px;
        }

        .blog-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 40px;
          padding: 20px;
        }

        .blog-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: fadeInUp 0.6s ease-out backwards;
          cursor: pointer;
          position: relative;
        }

        .blog-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .blog-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .blog-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blog-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .blog-image-wrapper {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
        }

        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .blog-image {
          transform: scale(1.1);
        }

        .blog-category {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          color: #f59e0b;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          z-index: 2;
        }

        .blog-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .blog-card:hover .blog-image-overlay {
          opacity: 1;
        }

        .blog-content {
          padding: 32px;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .blog-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .blog-meta-icon {
          width: 16px;
          height: 16px;
        }

        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 12px;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .blog-card:hover .blog-content h3 {
          color: #f59e0b;
        }

        .blog-content p {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .blog-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
          position: relative;
          overflow: hidden;
        }

        .blog-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .blog-button:hover::before {
          opacity: 1;
        }

        .blog-button span,
        .blog-button-icon {
          position: relative;
          z-index: 1;
        }

        .blog-button-icon {
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
        }

        .blog-button:hover .blog-button-icon {
          transform: translateX(4px);
        }

        .blog-button:hover {
          box-shadow: 0 6px 25px rgba(245, 158, 11, 0.4);
          transform: translateY(-2px);
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .floating-shape-1 {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .floating-shape-2 {
          width: 200px;
          height: 200px;
          bottom: 15%;
          right: 8%;
          animation-delay: 2s;
        }

        .floating-shape-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          left: 10%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @media (max-width: 768px) {
          .blog-section {
            padding: 60px 15px;
          }

          .blog-header h2 {
            font-size: 2.5rem;
          }

          .blog-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .blog-image-wrapper {
            height: 220px;
          }

          .blog-content {
            padding: 24px;
          }
        }
      `}</style>

      <section id="blog-section" className="blog-section">
        <div className="blog-bg-pattern"></div>
        
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>
        <div className="floating-shape floating-shape-3"></div>

        <div className="blog-wrapper">
          <div className="blog-header">
            <h2>About Parkinson's Disease</h2>
            <p className="blog-subtitle">
              Explore insights, research, and information about Parkinson's Disease
            </p>
          </div>

          <div className="blog-container">
            {blogs.map((blog, index) => (
              <div 
                className="blog-card" 
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="blog-image-wrapper">
                  <div className="blog-category">{blog.category}</div>
                  <img src={blog.image} alt={blog.title} className="blog-image" />
                  <div className="blog-image-overlay"></div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <div className="blog-meta-item">
                      <Calendar className="blog-meta-icon" />
                      <span>{blog.date}</span>
                    </div>
                    <div className="blog-meta-item">
                      <Clock className="blog-meta-icon" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>

                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  
                  <Link to={blog.link} className="blog-button">
                    <span>Read More</span>
                    <ArrowRight className="blog-button-icon" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;