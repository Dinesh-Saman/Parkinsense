// src/components/MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapView = ({ doctors = [] }) => {
  const center = doctors.length > 0
    ? [doctors[0].location.coordinates[1], doctors[0].location.coordinates[0]]
    : [7.8731, 80.7718];

  return (
    <MapContainer
      center={center}
      zoom={doctors.length > 0 ? 11 : 7}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {doctors.map((doc, i) => {
        const color = i === 0 ? "#f59e0b" : i === 1 ? "#6b7280" : "#dc2626";
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background:${color};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${i + 1}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        return (
          <Marker
            key={i}
            position={[doc.location.coordinates[1], doc.location.coordinates[0]]}
            icon={icon}
          >
            <Popup>
              <strong>{doc.name}</strong><br />
              {doc.hospital}<br />
              {doc.phone && `☎ ${doc.phone}`}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;