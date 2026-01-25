// src/components/Recommendation/RecommendationPage.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DoctorCard from "./DoctorCard";
import MapView from "./MapView";
import { useTranslation } from "react-i18next";

const RecommendationPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const cardsRef = useRef(null); // Measure doctor cards height
  const mapContainerRef = useRef(null); // Apply exact height to map

  const [recommendations, setRecommendations] = useState([]);
  const [patientStage, setPatientStage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/recommendations/${id}`);
        setRecommendations(data.recommendations || []);
        setPatientStage(data.patientStage || "");
      } catch {
        alert(t("error_fetch"));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, t]);

  // Dynamically set map height = doctor cards height
  useEffect(() => {
    if (!loading && cardsRef.current && mapContainerRef.current) {
      const height = cardsRef.current.offsetHeight;
      mapContainerRef.current.style.height = `${height}px`;
    }
  }, [recommendations, loading]);

  const styles = `
    .page { min-height: 100vh; background: linear-gradient(135deg, #e0f7fa, #b2ebf2, #80deea); padding: 2rem 1rem; font-family: 'Segoe UI', sans-serif; }
    .inner { max-width: 1200px; margin: 0 auto; }
    .back { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: #1e40af; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
    .header { text-align: center; margin-bottom: 2rem; }
    .header h1 { font-size: 2.75rem; font-weight: 800; background: linear-gradient(to right, #1e40af, #14b8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stage { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; border-radius: 9999px; font-weight: 600; }
    .mild { background: #d1fae5; color: #065f46; }
    .moderate { background: #fef3c7; color: #92400e; }
    .severe { background: #fee2e2; color: #991b1b; }
    .grid { display: grid; gap: 2rem; }
    @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; align-items: stretch; } }
    .cards { display: flex; flex-direction: column; gap: 1.5rem; }
    .card { position: relative; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.5); transition: all 0.3s; }
    .card:hover { transform: translateY(-6px); box-shadow: 0 16px 35px rgba(0,0,0,0.15); }
    .rank { position: absolute; top: -0.75rem; left: -0.75rem; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10; }
    .rank1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
    .rank2 { background: linear-gradient(135deg, #9ca3af, #6b7280); }
    .rank3 { background: linear-gradient(135deg, #fb923c, #dc2626); }
    .map-box { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-radius: 1.5rem; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.5); display: flex; flex-direction: column; }
    .map-head { background: linear-gradient(to right, #1e40af, #14b8a6); color: white; padding: 1rem 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
    .map-wrapper { flex: 1; min-height: 400px; }
    .map { height: 100%; width: 100%; }
    .no-data { background: rgba(255,255,255,0.7); padding: 3rem; border-radius: 1rem; text-align: center; color: #6b7280; font-size: 1.2rem; }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <div className="inner">
          <button className="back" onClick={() => navigate(-1)}>
            ← {t("back")}
          </button>

          <div className="header">
            <h1>{t("recommended_doctors")}</h1>
            {patientStage && (
              <div className={`stage ${patientStage.includes("Mild") ? "mild" : patientStage.includes("Moderate") ? "moderate" : "severe"}`}>
                {t("stage")}: <strong>{t(patientStage)}</strong>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid">
              <div className="cards">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card">
                    <div style={{ height: "1.5rem", background: "#e5e7eb", borderRadius: "0.5rem", marginBottom: "0.75rem" }}></div>
                    <div style={{ height: "1rem", background: "#e5e7eb", borderRadius: "0.5rem", width: "60%" }}></div>
                  </div>
                ))}
              </div>
              <div className="map-box">
                <div style={{ height: "100%", background: "#e5e7eb", borderRadius: "1rem" }}></div>
              </div>
            </div>
          ) : (
            <div className="grid">
              {/* Doctor Cards */}
              <div className="cards" ref={cardsRef}>
                {recommendations.length === 0 ? (
                  <div className="no-data">{t("no_doctors")}</div>
                ) : (
                  recommendations.map((doc, i) => (
                    <div key={doc._id || i} className="card">
                      {i < 3 && <div className={`rank rank${i + 1}`}>{i + 1}</div>}
                      <DoctorCard doctor={doc} />
                    </div>
                  ))
                )}
              </div>

              {/* Map - Same height as cards */}
              <div className="map-box">
                <div className="map-head">
                  <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
                    <path d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                  {t("location_map")}
                </div>
                <div className="map-wrapper" ref={mapContainerRef}>
                  <MapView doctors={recommendations} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecommendationPage;