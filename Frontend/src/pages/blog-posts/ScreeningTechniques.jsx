import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Database, Mic, Pencil, FileText, Cpu, Eye, Info, Sparkles } from "lucide-react";
import Footer from "../../components/Footer";

/**
 * Non-Invasive Screening Techniques Page
 */
const ScreeningTechniques = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-detail-container">
      <style>{`
        .blog-detail-page {
          background-color: #f5f3ff;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          color: #4c1d95;
          /* Removed extra top padding */
        }

        .blog-hero {
          position: relative;
          height: 65vh;
          min-height: 450px;
          display: flex;
          align-items: flex-start;
          padding-top: 120px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1576091160550-21735dba999ef?auto=format&fit=crop&w=1600&q=80') center/cover;
        }

        .blog-hero-content {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px;
          color: white;
        }

        .blog-tag {
          display: inline-block;
          background: #8b5cf6;
          color: white;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .blog-hero h1 {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }

        .blog-hero-meta {
          display: flex;
          gap: 24px;
          font-size: 1rem;
          opacity: 0.9;
        }

        .blog-body-wrapper {
          max-width: 900px;
          margin: -100px auto 100px;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .blog-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6d28d9;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 30px;
          padding: 12px 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .blog-content-card {
          background: white;
          padding: 60px;
          border-radius: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        }

        .blog-intro {
          font-size: 1.35rem;
          line-height: 1.8;
          color: #334155;
          margin-bottom: 40px;
          font-weight: 500;
          background: #f5f3ff;
          padding: 35px;
          border-radius: 24px;
          border-left: 6px solid #8b5cf6;
        }

        .blog-rich-text h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 60px;
          margin-bottom: 28px;
          color: #4c1d95;
        }

        .blog-rich-text p {
          font-size: 1.125rem;
          line-height: 1.9;
          margin-bottom: 28px;
          color: #475569;
        }

        .technique-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin: 60px 0;
        }

        .technique-item {
          display: flex;
          gap: 30px;
          background: #f8fafc;
          padding: 40px;
          border-radius: 32px;
          border: 1px solid #ede9fe;
        }

        .technique-icon-box {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.2);
          flex-shrink: 0;
        }

        .technique-text h4 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1f2937;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ede9fe;
          color: #6d28d9;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .call-to-action {
          text-align: center;
          background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
          color: white;
          padding: 60px 40px;
          border-radius: 32px;
          margin-top: 80px;
        }

        @media (max-width: 768px) {
          .blog-hero { height: 50vh; }
          .blog-content-card { padding: 35px; }
          .technique-item { flex-direction: column; padding: 30px; }
          .blog-rich-text h2 { font-size: 1.75rem; }
        }
      `}</style>
      
      <div className="blog-detail-page">
        <section className="blog-hero">
          <div className="blog-hero-content">
            <div className="blog-tag">Technology</div>
            <h1>Non-Invasive AI Screening Techniques for Parkinson's</h1>
            <div className="blog-hero-meta">
              <span><Calendar size={20} /> Oct 1, 2024</span>
              <span><Clock size={20} /> 7 min read</span>
            </div>
          </div>
        </section>

        <div className="blog-body-wrapper">
          <Link to="/#blog-section" className="blog-back-btn">
            <ArrowLeft size={20} /> Back to Insights
          </Link>

          <article className="blog-content-card">
            <p className="blog-intro">
              The future of Parkinson’s screening is no longer tied to long hospital wait times. Using non-invasive digital tools, we can now assess your neurological health in the comfort of your home.
            </p>

            <div className="blog-rich-text">
              <h2>How Digital Biomarkers Work</h2>
              <p>
                In the medical world, a "biomarker" is a measurable indicator of some biological state or condition. Traditional biomarkers for Parkinson's often involve complex blood tests or brain scans. Our approach focuses on <strong>digital biomarkers</strong>—microscopic changes in movement and speech that act as "digital fingerprints" of your neurological health.
              </p>

              <h2>Our Three-Pillar Screening Approach</h2>
              <p>We combine three distinct non-invasive techniques to provide a comprehensive look at your motor and cognitive wellness:</p>

              <div className="technique-container">
                <div className="technique-item">
                  <div className="technique-icon-box">
                    <Pencil size={40} />
                  </div>
                  <div className="technique-text">
                    <div className="ai-badge"><Cpu size={14} /> AI-Powered</div>
                    <h4>The Archimedian Spiral Drawing</h4>
                    <p>Parkinson’s often manifests in a loss of fluid, small-motor tremors. Our spiral test analyzes the speed, pressure, and deviation of your drawing in real-time. Even a tremor invisible to the naked eye can be picked up by our algorithms.</p>
                  </div>
                </div>

                <div className="technique-item">
                  <div className="technique-icon-box">
                    <Mic size={40} />
                  </div>
                  <div className="technique-text">
                    <div className="ai-badge"><Cpu size={14} /> AI-Powered</div>
                    <h4>Advanced Vocal Analysis</h4>
                    <p>Neurological changes can impact the vocal folds and the coordination of breath. By analyzing 20-second segments of your speech, we look for "vocal jitter" and "shimmer"—minute fluctuations that correlate with early-stage PD symptoms.</p>
                  </div>
                </div>

                <div className="technique-item">
                  <div className="technique-icon-box">
                    <FileText size={40} />
                  </div>
                  <div className="technique-text">
                    <h4>MDS-UPDRS Questionnaires</h4>
                    <p>The Unified Parkinson's Disease Rating Scale (UPDRS) is the gold standard used by doctors. We’ve digitized this process into a simple user interface that evaluates your day-to-day functional health.</p>
                  </div>
                </div>
              </div>

              <h2>The Power of Privacy and Data</h2>
              <p>
                We believe health data should be private. All our non-invasive tests are performed through secure browser-based sessions. We don't need your face or personal identity to perform the analysis—only the anonymized data from the tests themselves. 
              </p>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ScreeningTechniques;
