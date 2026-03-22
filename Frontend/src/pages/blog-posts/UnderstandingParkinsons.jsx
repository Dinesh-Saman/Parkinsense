import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertCircle, Activity, Heart, Shield } from "lucide-react";
import Footer from "../../components/Footer";

/**
 * Understanding Parkinson's Disease Page
 */
const UnderstandingParkinsons = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-detail-container">
      <style>{`
        .blog-detail-page {
          background-color: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          color: #1e293b;
          /* Removed extra top padding */
        }

        .blog-hero {
          position: relative;
          height: 65vh;
          min-height: 450px;
          display: flex;
          align-items: flex-start;
          padding-top: 120px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1600&q=80') center/cover;
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
          background: #f59e0b;
          color: white;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        .blog-hero-meta span {
          display: flex;
          align-items: center;
          gap: 8px;
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
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 30px;
          padding: 12px 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-back-btn:hover {
          color: #4f46e5;
          transform: translateX(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .blog-content-card {
          background: white;
          padding: 60px;
          border-radius: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255,255,255,0.7);
        }

        .blog-intro {
          font-size: 1.35rem;
          line-height: 1.8;
          color: #334155;
          margin-bottom: 40px;
          font-weight: 500;
          border-left: 6px solid #f59e0b;
          padding-left: 30px;
        }

        .blog-rich-text h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 60px;
          margin-bottom: 28px;
          color: #0f172a;
          letter-spacing: -0.025em;
        }

        .blog-rich-text p {
          font-size: 1.125rem;
          line-height: 1.9;
          margin-bottom: 28px;
          color: #475569;
        }

        .item-list {
          list-style: none;
          padding: 0;
          margin: 30px 0;
        }

        .item-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 1.125rem;
          color: #475569;
        }

        .item-list li svg {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .symptom-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 40px 0;
        }

        .symptom-card {
          background: #f8fafc;
          padding: 35px;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .symptom-card:hover {
          background: white;
          border-color: #f59e0b;
          box-shadow: 0 10px 30px -5px rgba(245, 158, 11, 0.15);
          transform: translateY(-5px);
        }

        .symptom-card h4 {
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0f172a;
        }

        .info-box {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 28px;
          padding: 40px;
          margin: 60px 0;
          border: 1px solid #bfdbfe;
          display: flex;
          gap: 20px;
        }

        .info-box-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .info-box h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 12px;
        }

        .call-to-action {
          text-align: center;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 60px 40px;
          border-radius: 32px;
          margin-top: 80px;
          box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.3);
        }

        .call-to-action h2 {
          font-size: 2.75rem;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .cta-btn {
          display: inline-block;
          background: white;
          color: #4f46e5;
          padding: 18px 40px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          margin-top: 30px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .cta-btn:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .blog-hero { height: 50vh; }
          .blog-content-card { padding: 35px; border-radius: 24px; }
          .blog-rich-text h2 { font-size: 1.75rem; }
          .blog-hero h1 { font-size: 2.5rem; }
          .info-box { flex-direction: column; padding: 30px; }
        }
      `}</style>
      
      <div className="blog-detail-page">
        <section className="blog-hero">
          <div className="blog-hero-content">
            <div className="blog-tag">Medical Education</div>
            <h1>Understanding Parkinson's Disease: A Complete Guide</h1>
            <div className="blog-hero-meta">
              <span><Calendar size={20} /> Oct 5, 2024</span>
              <span><Clock size={20} /> 8 min read</span>
            </div>
          </div>
        </section>

        <div className="blog-body-wrapper">
          <Link to="/#blog-section" className="blog-back-btn">
            <ArrowLeft size={20} /> Back to Insights
          </Link>

          <article className="blog-content-card">
            <p className="blog-intro">
              Parkinson's disease (PD) is an incredibly complex degenerative disorder of the central nervous system. While it's primarily known for affecting movement, it impact spans physical, cognitive, and emotional health. Understanding its mechanism is the first essential step for patients and caregivers alike.
            </p>

            <div className="blog-rich-text">
              <h2>What is Parkinson's?</h2>
              <p>
                Parkinson's disease occurs when specific nerve cells, or neurons, in an area of the brain called the <strong>substantia nigra</strong> begin to malfunction and die. These neurons are responsible for producing <strong>dopamine</strong>, a critical chemical messenger that facilitates communication between the brain and the muscles.
              </p>
              <p>
                When around 60% to 80% of these dopamine-producing cells are lost, the symptoms of Parkinson's begin to appear. The lack of dopamine disrupts the brain's ability to coordinate smooth, purposeful movements.
              </p>

              <div className="info-box">
                <Shield className="info-box-icon" size={32} />
                <div>
                  <h3>Did You Know?</h3>
                  <p>Nearly 10 million people worldwide are living with Parkinson's. While the incidence increases with age, genetic research suggests it's not a single disease but rather a complex syndrome with various causes.</p>
                </div>
              </div>

              <h2>Primary Motor Symptoms</h2>
              <p>The core movement-related symptoms are often referred to as "cardinal signs." While everyone experiences Parkinson's differently, these four symptoms are the most common early detection points:</p>
              
              <div className="symptom-grid">
                <div className="symptom-card">
                  <h4><Activity size={24} /> Tremors</h4>
                  <p>Involuntary shaking that often starts in a single hand or limb. Typically occurs at rest (resting tremor) and improves when the limb is in use.</p>
                </div>
                <div className="symptom-card">
                  <h4><Activity size={24} /> Bradykinesia</h4>
                  <p>Generalized slowness of movement. Routine tasks like buttoning a shirt or walking to the car become exhausting and significantly slower.</p>
                </div>
                <div className="symptom-card">
                  <h4><Activity size={24} /> Rigid Muscles</h4>
                  <p>Stiffness that limits your range of motion. It can occur in any part of the body and is often described as "cogwheel" movements by clinicians.</p>
                </div>
                <div className="symptom-card">
                  <h4><Activity size={24} /> Balance Issues</h4>
                  <p>Known as postural instability, this symptom often appears later in the disease, making falls more frequent and movements more cautious.</p>
                </div>
              </div>

              <h2>Who is at Risk?</h2>
              <p>Researchers believe a combination of genetic and environmental factors is responsible for the development of PD:</p>
              <ul className="item-list">
                <li><CheckCircle2 size={18} /> <strong>Age:</strong> The biggest risk factor. Most cases are diagnosed over the age of 60.</li>
                <li><CheckCircle2 size={18} /> <strong>Genetics:</strong> About 10-15% of cases are linked to specific genetic mutations.</li>
                <li><CheckCircle2 size={18} /> <strong>Gender:</strong> Men are 1.5 times more likely to develop Parkinson's than women.</li>
                <li><CheckCircle2 size={18} /> <strong>Environment:</strong> Exposure to certain pesticides and herbicides may increase long-term risk.</li>
              </ul>

              <h2>Beyond Movement: Non-Motor Symptoms</h2>
              <p>
                It is important to recognize that Parkinson's is not just a movement disorder. Many patients experience "invisible" symptoms that can appear years before tremors do:
              </p>
              <ul className="item-list">
                <li><AlertCircle size={18} /> Loss of sense of smell (Anosmia)</li>
                <li><AlertCircle size={18} /> Sleep disorders and vivid dreams</li>
                <li><AlertCircle size={18} /> Mood changes including anxiety and depression</li>
                <li><AlertCircle size={18} /> Cognitive changes or "brain fog"</li>
              </ul>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UnderstandingParkinsons;
