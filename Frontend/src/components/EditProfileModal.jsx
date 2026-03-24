import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaUserEdit, FaBrain, FaUser, FaUserMd, FaCheckCircle } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const EditProfileModal = () => {
  const { user, token, isEditProfileModalOpen, closeEditProfileModal, updateProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [slmcNumber, setSlmcNumber] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (isEditProfileModalOpen && user) {
      setName(user.name || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setSpecialization(user.specialization || "");
      setSlmcNumber(user.slmcNumber || user.license || "");
      setError("");
      setSuccessMsg("");
    }
  }, [isEditProfileModalOpen, user]);

  // Body Scroll Lock
  useEffect(() => {
    if (isEditProfileModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isEditProfileModalOpen]);

  if (!isEditProfileModalOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const body = { name };
      if (user.role === "patient") { 
        body.age = age; 
        body.gender = gender; 
      }
      if (user.role === "doctor") { 
        if (!specialization) { setError("Specialization is required."); setLoading(false); return; }
        if (!slmcNumber) { setError("SLMC Number is required."); setLoading(false); return; }
        body.specialization = specialization; 
        body.slmcNumber = slmcNumber; 
      }
      if (user.role === "patient") {
        if (!age) { setError("Age is required."); setLoading(false); return; }
        body.age = age;
        body.gender = gender;
      }

      const res = await fetch(`${API}/auth/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile.");
      } else {
        setSuccessMsg("Profile updated successfully!");
        updateProfile(data.user);
        setTimeout(() => {
          closeEditProfileModal();
        }, 1500);
      }
    } catch (err) {
      console.error("Profile Update Error:", err);
      setError("An unexpected error occurred. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-modal-overlay">
      <div className="ps-profile-card">
        <button className="ps-modal-close" onClick={closeEditProfileModal}>
          <FaTimes />
        </button>

        <div className="ps-profile-header">
          <div className="ps-profile-icon-bg">
            <FaUserEdit size={30} />
          </div>
          <h2>Edit Profile</h2>
          <p className="ps-profile-subtitle">Update your personal information below.</p>
        </div>

        <form onSubmit={handleSubmit} className="ps-profile-form">
          <div className="ps-input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {user.role === "patient" && (
            <div className="ps-form-row">
              <div className="ps-input-group">
                <label>Age</label>
                <input 
                  type="number" 
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 55"
                />
              </div>
              <div className="ps-input-group">
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled>Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {user.role === "doctor" && (
            <div className="ps-form-row">
              <div className="ps-input-group">
                <label>Specialization</label>
                <select
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="" disabled>Select specialization</option>
                  <optgroup label="Neurology &amp; Brain">
                    <option value="Neurologist">Neurologist</option>
                    <option value="Neurosurgeon">Neurosurgeon</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Psychologist">Psychologist</option>
                  </optgroup>
                  <optgroup label="Internal Medicine">
                    <option value="General Physician">General Physician</option>
                    <option value="Internist">Internist</option>
                    <option value="Endocrinologist">Endocrinologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                    <option value="Hepatologist">Hepatologist</option>
                    <option value="Pulmonologist">Pulmonologist</option>
                    <option value="Rheumatologist">Rheumatologist</option>
                    <option value="Hematologist">Hematologist</option>
                    <option value="Nephrologist">Nephrologist</option>
                    <option value="Infectious Disease Specialist">Infectious Disease Specialist</option>
                  </optgroup>
                  <optgroup label="Cardiovascular">
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Cardiothoracic Surgeon">Cardiothoracic Surgeon</option>
                    <option value="Vascular Surgeon">Vascular Surgeon</option>
                  </optgroup>
                  <optgroup label="Surgery">
                    <option value="General Surgeon">General Surgeon</option>
                    <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                    <option value="Plastic Surgeon">Plastic Surgeon</option>
                    <option value="Colorectal Surgeon">Colorectal Surgeon</option>
                    <option value="Urologist">Urologist</option>
                  </optgroup>
                  <optgroup label="Women's Health">
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Obstetrician">Obstetrician</option>
                    <option value="Reproductive Endocrinologist">Reproductive Endocrinologist</option>
                    <option value="Maternal-Fetal Medicine">Maternal-Fetal Medicine</option>
                  </optgroup>
                  <optgroup label="Children's Health">
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Pediatric Neurologist">Pediatric Neurologist</option>
                    <option value="Neonatologist">Neonatologist</option>
                  </optgroup>
                  <optgroup label="Oncology">
                    <option value="Oncologist">Oncologist</option>
                    <option value="Radiation Oncologist">Radiation Oncologist</option>
                    <option value="Surgical Oncologist">Surgical Oncologist</option>
                  </optgroup>
                  <optgroup label="Sensory &amp; Skin">
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Otolaryngologist (ENT)">Otolaryngologist (ENT)</option>
                    <option value="Dermatologist">Dermatologist</option>
                  </optgroup>
                  <optgroup label="Bones &amp; Joints">
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="Sports Medicine">Sports Medicine</option>
                    <option value="Physical Medicine &amp; Rehabilitation">Physical Medicine &amp; Rehabilitation</option>
                  </optgroup>
                  <optgroup label="Emergency &amp; Critical Care">
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Critical Care / Intensivist">Critical Care / Intensivist</option>
                    <option value="Anesthesiologist">Anesthesiologist</option>
                  </optgroup>
                  <optgroup label="Radiology &amp; Pathology">
                    <option value="Radiologist">Radiologist</option>
                    <option value="Pathologist">Pathologist</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="Geriatrician">Geriatrician</option>
                    <option value="Palliative Care Specialist">Palliative Care Specialist</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Occupational Medicine">Occupational Medicine</option>
                    <option value="Allergist / Immunologist">Allergist / Immunologist</option>
                    <option value="Other">Other</option>
                  </optgroup>
                </select>
              </div>
              <div className="ps-input-group">
                <label>SLMC Number</label>
                <input 
                  type="text" 
                  required
                  value={slmcNumber}
                  onChange={(e) => setSlmcNumber(e.target.value)}
                  placeholder="SLMC Number"
                />
              </div>
            </div>
          )}

          {(error || successMsg) && (
            <div className="ps-modal-alerts">
              {error && <div className="ps-alert ps-alert-error">{error}</div>}
              {successMsg && (
                <div className="ps-alert ps-alert-success">
                  <FaCheckCircle /> {successMsg}
                </div>
              )}
            </div>
          )}

          <button type="submit" className="ps-profile-save-btn" disabled={loading}>
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>

      <style>{`
        .ps-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: ps-modal-fade 0.3s ease;
        }

        @keyframes ps-modal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ps-profile-card {
          width: 100%;
          max-width: 480px;
          background: white;
          border-radius: 24px;
          position: relative;
          padding: 24px 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: ps-card-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes ps-card-slide {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }

        .ps-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .ps-modal-close:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .ps-profile-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .ps-profile-icon-bg {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
        }

        .ps-profile-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .ps-profile-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin-top: 8px;
        }

        .ps-profile-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ps-form-row {
          display: flex;
          gap: 16px;
        }

        .ps-form-row > .ps-input-group {
          flex: 1;
        }

        .ps-input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
        }

        .ps-input-group input, 
        .ps-input-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }

        .ps-input-group input:focus,
        .ps-input-group select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .ps-modal-alerts {
          margin-bottom: 16px;
        }

        .ps-alert {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ps-alert-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fee2e2;
        }

        .ps-alert-success {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #dcfce7;
        }

        .ps-profile-save-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(to right, #6366f1, #9333ea);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
        }

        .ps-profile-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -8px rgba(99, 102, 241, 0.4);
        }

        .ps-profile-save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EditProfileModal;
