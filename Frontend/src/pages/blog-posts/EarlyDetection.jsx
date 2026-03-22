import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, CheckCircle, Brain, Target, Zap, Waves, Microscope } from "lucide-react";
import Footer from "../../components/Footer";

/**
 * Importance of Early Detection Page
 */
const EarlyDetection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-detail-container">
      <style>{`
        .blog-detail-page {
          background-color: #f0f9ff;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          color: #0c4a6e;
          /* Removed extra top padding */
        }

        .blog-hero {
          position: relative;
          height: 65vh;
          min-height: 450px;
          display: flex;
          align-items: flex-start;
          padding-top: 120px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80') center/cover;
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
          background: #0ea5e9;
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
          color: #0369a1;
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
          background: #f0f9ff;
          padding: 35px;
          border-radius: 24px;
          border-right: 6px solid #0ea5e9;
        }

        .blog-rich-text h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 60px;
          margin-bottom: 28px;
          color: #0c4a6e;
        }

        .blog-rich-text p {
          font-size: 1.125rem;
          line-height: 1.9;
          margin-bottom: 28px;
          color: #475569;
        }

        .strategy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 40px 0;
        }

        .strategy-card {
          padding: 30px;
          border-radius: 24px;
          border: 1px solid #e0f2fe;
          background: #f8fafc;
        }

        .strategy-card h4 {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0369a1;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .benefit-list {
          list-style: none;
          padding: 0;
          margin: 40px 0;
        }

        .benefit-item {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          background: #f0f9ff;
          padding: 24px;
          border-radius: 20px;
        }

        .benefit-icon {
          color: #0284c7;
          flex-shrink: 0;
        }

        .benefit-text h5 {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 6px;
        }

        .call-to-action {
          text-align: center;
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
          color: white;
          padding: 60px 40px;
          border-radius: 32px;
          margin-top: 80px;
        }

        .cta-btn {
          display: inline-block;
          background: white;
          color: #0284c7;
          padding: 18px 40px;
          border-radius: 20px;
          font-weight: 700;
          text-decoration: none;
          margin-top: 30px;
        }

        @media (max-width: 768px) {
          .blog-hero { height: 50vh; }
          .blog-content-card { padding: 35px; }
          .blog-rich-text h2 { font-size: 1.75rem; }
        }
      `}</style>
      
      <div className="blog-detail-page">
        <section className="blog-hero">
          <div className="blog-hero-content">
            <div className="blog-tag">Prevention</div>
            <h1>The Vital Importance of Early Parkinson's Detection</h1>
            <div className="blog-hero-meta">
              <span><Calendar size={20} /> Oct 3, 2024</span>
              <span><Clock size={20} /> 6 min read</span>
            </div>
          </div>
        </section>

        <div className="blog-body-wrapper">
          <Link to="/#blog-section" className="blog-back-btn">
            <ArrowLeft size={20} /> Back to Insights
          </Link>

          <article className="blog-content-card">
            <p className="blog-intro">
              Detecting Parkinson's disease early is not just about identifying symptoms—it's about fundamentally changing the disease's trajectory and securing a higher quality of life for long-term health.
            </p>

            <div className="blog-rich-text">
              <h2>Why Early Detection Matters</h2>
              <p>
                Parkinson’s is notoriously difficult to diagnose in its earliest stages. Often, by the time tremors or significant motor symptoms appear, a large percentage of dopamine-producing brain cells have already been lost. Identifying the condition in its <strong>prodromal stage</strong> (the period before full clinical symptoms emerge) allows for more effective intervention.
              </p>

              <h2>The Benefits of Early Intervention</h2>
              <div className="benefit-list">
                <div className="benefit-item">
                  <Brain className="benefit-icon" size={32} />
                  <div className="benefit-text">
                    <h5>Symptom Management</h5>
                    <p>Starting treatment early can help keep symptoms under control and extend the period of peak physical function.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <Waves className="benefit-icon" size={32} />
                  <div className="benefit-text">
                    <h5>Lifestyle Adjustments</h5>
                    <p>Early diagnosis gives patients more time to implement health-protective measures like vigorous exercise programs.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <Target className="benefit-icon" size={32} />
                  <div className="benefit-text">
                    <h5>Access to Trials</h5>
                    <p>Many clinical trials for new neuroprotective therapies require participants who are in the very early stages of the disease.</p>
                  </div>
                </div>
              </div>

              <h2>Early "Silent" Warning Signs</h2>
              <p>Pay attention to these subtle changes that can occur years before motor issues:</p>
              
              <div className="strategy-grid">
                <div className="strategy-card">
                  <h4><Zap size={24} /> Sleep Disruptions</h4>
                  <p>Acting out dreams or experiencing restless sleep consistently over time.</p>
                </div>
                <div className="strategy-card">
                  <h4><Zap size={24} /> Small Handwriting</h4>
                  <p>Known as micrographia—a sudden change where words become small and cramped.</p>
                </div>
                <div className="strategy-card">
                  <h4><Zap size={24} /> Softened Voice</h4>
                  <p>Changes in speech volume or a sudden "monotone" quality to your voice.</p>
                </div>
              </div>

              <h2>How AI Changes the Game</h2>
              <p>
                Modern technology, like the screening tools offered here at ParkinSense, uses artificial intelligence to analyze patterns that are too subtle for the human eye or ear to detect. Through voice analysis and spiral drawing tests, we can identify microscopic changes in motor control that may signal the early presence of PD.
              </p>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EarlyDetection;
