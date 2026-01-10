// src/components/Recommendation/DoctorCard.jsx
import React from "react";

const DoctorCard = ({ doctor, patientLat, patientLng }) => {
  const openDirections = () => {
    const origin = patientLat && patientLng
      ? `${patientLat},${patientLng}`
      : "";
    const destination = `${doctor.location.coordinates[1]},${doctor.location.coordinates[0]}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    window.open(url, "_blank");
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(10px)",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.5)",
      position: "relative"
    }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#1e3a8a" }}>
        {doctor.name}
      </h3>
      <p style={{ color: "#4b5563", margin: "0.5rem 0" }}>{doctor.hospital}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "1rem 0" }}>
        {doctor.specialty?.map((s, i) => (
          <span key={i} style={{
            background: "#ccfbf1",
            color: "#0f766e",
            padding: "0.25rem 0.75rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem"
          }}>
            {s}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.9rem" }}>
          <span>⭐ {doctor.rating}/5</span>
          <span>📍 {doctor.distance?.toFixed(1)} km</span>
          {doctor.phone && <span>☎ {doctor.phone}</span>} {/* ← Phone number displayed here */}
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={openDirections}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;