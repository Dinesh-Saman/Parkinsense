// src/components/MDS-UPDRS/AssessmentForm.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUserMd, 
  FaUserInjured, 
  FaIdCard, 
  FaMapMarkerAlt, 
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaCheckCircle,
  FaClipboardCheck,
  FaBrain,
  FaHandsHelping,
  FaWalking,
  FaChartLine,
  FaFileMedical,
  FaShieldAlt,
  FaClock,
  FaHospital,
  FaStethoscope,
  FaCalendarAlt,
  FaVenusMars,
  FaDatabase,
  FaPaperPlane,
  FaChartBar,
  FaCog,
  FaBell,
  FaHistory
} from "react-icons/fa";
import { GiHospitalCross, GiMedicalPack, GiHealthPotion } from "react-icons/gi";
import { TbChartArcs } from "react-icons/tb";
import ConsentModal from "../MDS-UPDRS/ConsentModel";
import PartForm from "./PartForm";
import Summary from "./Summary";
import { MDS_UPDRS_ITEMS } from "./mdsItems";
import "./AssessmentForm.css";

const STEPS = [
  { id: 0, name: "Patient Info", icon: <FaUserInjured />, color: "#3B82F6" },
  { id: 1, name: "Part I", icon: <FaBrain />, description: "Non-Motor Symptoms", color: "#8B5CF6" },
  { id: 2, name: "Part II", icon: <FaHandsHelping />, description: "Motor Experiences", color: "#06B6D4" },
  { id: 3, name: "Part III", icon: <FaWalking />, description: "Motor Examination", color: "#10B981" },
  { id: 4, name: "Part IV", icon: <FaChartLine />, description: "Motor Complications", color: "#F59E0B" },
  { id: 5, name: "Summary", icon: <FaClipboardCheck />, color: "#EF4444" }
];

function AssessmentForm() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [showConsent, setShowConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    doctorName: "",
    clinicName: "",
    patientAge: "",
    patientGender: "",
    assessmentDate: new Date().toISOString().split('T')[0],
    consent: false,
    part1: new Map(),
    part2: new Map(),
    part3: new Map(),
    part4: new Map(),
  });

  // === Load from localStorage ===
  useEffect(() => {
    const saved = localStorage.getItem("updrs-form");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      const restoreMap = (obj) => new Map(Object.entries(obj || {}));

      setFormData({
        patientName: data.patientName || "",
        patientId: data.patientId || "",
        doctorName: data.doctorName || "",
        clinicName: data.clinicName || "",
        patientAge: data.patientAge || "",
        patientGender: data.patientGender || "",
        assessmentDate: data.assessmentDate || new Date().toISOString().split('T')[0],
        consent: data.consent || false,
        part1: restoreMap(data.part1),
        part2: restoreMap(data.part2),
        part3: restoreMap(data.part3),
        part4: restoreMap(data.part4),
      });
      setCurrentStep(data.currentStep || 0);
      setShowConsent(!data.consent);
      setLastSaved(data.lastSaved ? new Date(data.lastSaved).toLocaleTimeString() : null);
    } catch (err) {
      console.error("Failed to load saved form:", err);
    }
  }, []);

  // === Save to localStorage with timestamp ===
  useEffect(() => {
    const toPlain = (map) => Object.fromEntries(map);
    const saveData = {
      ...formData,
      part1: toPlain(formData.part1),
      part2: toPlain(formData.part2),
      part3: toPlain(formData.part3),
      part4: toPlain(formData.part4),
      currentStep,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem("updrs-form", JSON.stringify(saveData));
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [formData, currentStep]);

  // === Get User Location ===
  useEffect(() => {
    if ("geolocation" in navigator && !location.lat) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationError(false);
        },
        (err) => {
          console.warn("Location access denied:", err);
          setLocationError(true);
          setLocation({ lat: 6.9271, lng: 79.8612 });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    }
  }, [location.lat]);

  const updateScore = (part, id, score) => {
    const map = new Map(formData[part]);
    if (score === null) map.delete(id);
    else map.set(id, score);
    setFormData((prev) => ({ ...prev, [part]: map }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  const goToStep = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!formData.patientName.trim()) {
        alert("Please enter patient name");
        return false;
      }
      if (!formData.patientId.trim()) {
        alert("Please enter patient ID");
        return false;
      }
      if (!formData.doctorName.trim()) {
        alert("Please enter doctor name");
        return false;
      }
    }
    return true;
  };

  const submitAssessment = async () => {
    if (!formData.consent) {
      alert("Consent is required to proceed with the assessment.");
      return;
    }

    if (locationError) {
      if (!confirm("Location access was denied. Assessment will be saved with default location (Colombo). Continue?")) {
        return;
      }
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        lat: location.lat,
        lng: location.lng,
        locationError,
        part1: Object.fromEntries(formData.part1),
        part2: Object.fromEntries(formData.part2),
        part3: Object.fromEntries(formData.part3),
        part4: Object.fromEntries(formData.part4),
      };

      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await axios.post("http://localhost:5000/api/assessments", payload);
      const assessmentId = res.data.data.id;

      localStorage.removeItem("updrs-form");
      
      // Show success notification
      alert("✅ Assessment successfully saved! Generating personalized recommendations...");
      
      // Navigate to recommendations
      navigate(`/recommendations/${assessmentId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Failed to save assessment. Please check your connection and try again.";
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    if (formData.patientName) completed++;
    if (formData.patientId) completed++;
    if (formData.doctorName) completed++;
    if (formData.clinicName) completed++;
    if (formData.patientAge) completed++;
    if (formData.patientGender) completed++;
    total += 6;

    const parts = ['part1', 'part2', 'part3', 'part4'];
    parts.forEach(part => {
      const items = MDS_UPDRS_ITEMS[part];
      total += items?.length || 0;
      completed += formData[part].size;
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const completionPercentage = calculateCompletion();
  const currentStepData = STEPS[currentStep];

  return (
    <div className="mds-updrs-container">
      <div className="main-wrapper">
        {/* Top Header */}
        <div className="top-header">
          <div className="header-left">
            <GiHospitalCross className="header-logo" />
            <div className="header-title">
              <h1>MDS-UPDRS Assessment Portal</h1>
              <p>Movement Disorder Society - Unified Parkinson's Disease Rating Scale</p>
            </div>
          </div>
          <div className="header-right">
            <div className="header-status">
              <div className="status-item">
                <FaDatabase className="status-icon" />
                <span>Auto-save: <strong>Active</strong></span>
                {lastSaved && (
                  <span className="save-time">Last: {lastSaved}</span>
                )}
              </div>
              <div className="progress-indicator">
                <div className="progress-label">Completion</div>
                <div className="progress-value">{completionPercentage}%</div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ background: `linear-gradient(90deg, ${currentStepData.color}, ${STEPS[Math.min(currentStep + 1, STEPS.length - 1)].color})` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          {/* Sidebar Navigation */}
          <div className="sidebar">
            <div className="step-list">
              {STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={`step-item ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}
                  onClick={() => goToStep(index)}
                  style={{ cursor: index <= currentStep ? 'pointer' : 'not-allowed' }}
                >
                  <div className="step-icon-wrapper" style={{ background: step.color }}>
                    {step.icon}
                  </div>
                  <div className="step-content">
                    <span className="step-name">{step.name}</span>
                    {step.description && (
                      <span className="step-desc">{step.description}</span>
                    )}
                  </div>
                  {index < currentStep && (
                    <FaCheckCircle className="step-check" />
                  )}
                  {index === currentStep && (
                    <div className="step-indicator">
                      <div className="pulse-dot"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="sidebar-info">
              <div className="info-card">
                <FaShieldAlt className="info-icon" />
                <div className="info-content">
                  <div className="info-title">Secure & Compliant</div>
                  <div className="info-desc">HIPAA compliant data encryption</div>
                </div>
              </div>
              <div className="info-card">
                <FaFileMedical className="info-icon" />
                <div className="info-content">
                  <div className="info-title">MDS Certified</div>
                  <div className="info-desc">Official assessment tool</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="content-area">
            <div className="main-content">
              <AnimatePresence mode="wait">
                {showConsent && (
                  <ConsentModal
                    onAgree={() => {
                      setFormData((prev) => ({ ...prev, consent: true }));
                      setShowConsent(false);
                    }}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {/* Patient Information */}
                {currentStep === 0 && !showConsent && (
                  <motion.div
                    key="patient-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="form-section"
                  >
                    <div className="section-header">
                      <div className="section-icon">
                        <FaUserInjured />
                      </div>
                      <div className="section-title">
                        <h2>Patient Information</h2>
                        <p>Enter the patient's demographic and clinical details</p>
                      </div>
                    </div>

                    <div className="form-content">
                      <div className="form-grid">
                        <div className="form-card">
                          <label className="form-label">
                            <FaUserInjured className="label-icon" />
                            Patient Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter patient's full name"
                            className="form-input"
                            value={formData.patientName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, patientName: e.target.value }))
                            }
                          />
                          <div className="form-hint">Required field</div>
                        </div>

                        <div className="form-card">
                          <label className="form-label">
                            <FaIdCard className="label-icon" />
                            Patient ID *
                          </label>
                          <input
                            type="text"
                            placeholder="PD-YYYY-XXX"
                            className="form-input"
                            value={formData.patientId}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, patientId: e.target.value }))
                            }
                          />
                          <div className="form-hint">Format: PD-2024-001</div>
                        </div>

                        <div className="form-card">
                          <label className="form-label">
                            <FaUserMd className="label-icon" />
                            Physician Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter physician's name"
                            className="form-input"
                            value={formData.doctorName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, doctorName: e.target.value }))
                            }
                          />
                          <div className="form-hint">Attending physician</div>
                        </div>

                        <div className="form-card">
                          <label className="form-label">
                            <FaHospital className="label-icon" />
                            Medical Facility
                          </label>
                          <input
                            type="text"
                            placeholder="Enter hospital/clinic name"
                            className="form-input"
                            value={formData.clinicName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, clinicName: e.target.value }))
                            }
                          />
                        </div>

                        <div className="form-card">
                          <label className="form-label">
                            <span className="label-icon">#</span>
                            Age
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              placeholder="65"
                              min="0"
                              max="120"
                              className="form-input"
                              value={formData.patientAge}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, patientAge: e.target.value }))
                              }
                            />
                            <span className="input-suffix">years</span>
                          </div>
                          <div className="form-hint">Patient's current age</div>
                        </div>

                        <div className="form-card">
                          <label className="form-label">
                            <FaVenusMars className="label-icon" />
                            Gender
                          </label>
                          <div className="gender-selector">
                            {['male', 'female', 'other', 'prefer-not-to-say'].map(gender => (
                              <button
                                key={gender}
                                className={`gender-option ${formData.patientGender === gender ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, patientGender: gender }))}
                              >
                                {gender === 'male' ? 'Male' : 
                                 gender === 'female' ? 'Female' : 
                                 gender === 'other' ? 'Other' : 'Prefer not to say'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Assessment Details Card */}
                      <div className="assessment-details">
                        <div className="details-header">
                          <FaCalendarAlt className="details-icon" />
                          <h3>Assessment Details</h3>
                        </div>
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Assessment Date</span>
                            <div className="date-input-wrapper">
                              <FaCalendarAlt className="date-icon" />
                              <input
                                type="date"
                                className="date-input"
                                value={formData.assessmentDate}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, assessmentDate: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Location</span>
                            <div className={`location-status ${locationError ? 'error' : location.lat ? 'success' : 'loading'}`}>
                              <FaMapMarkerAlt />
                              <span>
                                {locationError 
                                  ? "Default Location (Colombo)"
                                  : location.lat 
                                  ? `GPS: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                                  : "Acquiring location..."}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Session Status</span>
                            <div className="save-status">
                              <FaHistory />
                              <span>Auto-save active • Last: {lastSaved || "Never"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons - AT BOTTOM WITH MARGINS */}
                    <div className="bottom-navigation">
                      <div className="nav-container">
                        <div className="nav-buttons-wrapper">
                          <div className="nav-buttons">
                            <div className="button-group left">
                              {currentStep > 0 && (
                                <button className="nav-button prev" onClick={prevStep}>
                                  <FaChevronLeft />
                                  <span>Back</span>
                                </button>
                              )}
                            </div>
                            <div className="button-group right ">
                              <button 
                                className="nav-button next"
                                onClick={nextStep}
                                disabled={
                                  (currentStep === 0 &&
                                    (!formData.patientName || !formData.patientId || !formData.doctorName))
                                }
                              >
                                <span>{currentStep === 0 ? "Begin Assessment" : "Continue"}</span>
                                <FaChevronRight />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* MDS-UPDRS Parts */}
                {currentStep >= 1 && currentStep <= 4 && !showConsent && (
                  <motion.div
                    key={`part-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-section"
                  >
                    <div className="part-header" style={{ background: `linear-gradient(90deg, ${currentStepData.color}, ${STEPS[Math.min(currentStep + 1, STEPS.length - 1)].color})` }}>
                      <div className="part-icon">
                        {currentStepData.icon}
                      </div>
                      <div className="part-title">
                        <h2>{currentStepData.name}</h2>
                        <p>{currentStepData.description}</p>
                      </div>
                      <div className="part-score">
                        <span className="score-label">Items Completed</span>
                        <span className="score-value">
                          {formData[["part1", "part2", "part3", "part4"][currentStep - 1]].size}
                          /{MDS_UPDRS_ITEMS[["part1", "part2", "part3", "part4"][currentStep - 1]]?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="form-content">
                      <PartForm
                        part={["part1", "part2", "part3", "part4"][currentStep - 1]}
                        items={MDS_UPDRS_ITEMS[["part1", "part2", "part3", "part4"][currentStep - 1]]}
                        scores={formData[["part1", "part2", "part3", "part4"][currentStep - 1]]}
                        onUpdate={updateScore}
                      />
                    </div>

                    {/* Navigation Buttons - AT BOTTOM WITH MARGINS */}
                    <div className="bottom-navigation">
                      <div className="nav-container">
                        <div className="nav-buttons-wrapper">
                          <div className="nav-buttons">
                            <div className="button-group left">
                              <button className="nav-button prev" onClick={prevStep}>
                                <FaChevronLeft />
                                <span>Back</span>
                              </button>
                            </div>
                            <div className="button-group right">
                              <button 
                                className="nav-button next"
                                onClick={nextStep}
                              >
                                <span>Continue</span>
                                <FaChevronRight />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary */}
                {currentStep === 5 && !showConsent && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="form-section"
                  >
                    <div className="form-content">
                      <Summary
                        formData={formData}
                        location={location}
                        loading={loading}
                        onPrev={prevStep}
                      />
                    </div>

                    {/* Navigation Buttons - AT BOTTOM WITH MARGINS */}
                    <div className="bottom-navigation">
                      <div className="nav-container">
                        <div className="nav-buttons-wrapper">
                          <div className="nav-buttons">
                            <div className="button-group left">
                              <button className="nav-button prev" onClick={prevStep}>
                                <FaChevronLeft />
                                <span>Back</span>
                              </button>
                            </div>
                            <div className="button-group right">
                              <button 
                                className="nav-button submit"
                                onClick={submitAssessment}
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <div className="spinner"></div>
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <FaPaperPlane />
                                    <span>Submit Assessment</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <FaFileMedical className="footer-icon" />
              <span>© 2008 International Parkinson and Movement Disorder Society</span>
            </div>
            <div className="footer-center">
              <TbChartArcs className="footer-icon" />
              <span>MDS-UPDRS Version 2.0 • Clinical Assessment Tool</span>
            </div>
            <div className="footer-right">
              <div className="version">v1.0.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .mds-updrs-container {
          --primary-blue: #1E40AF;
          --secondary-blue: #3B82F6;
          --accent-purple: #8B5CF6;
          --success-green: #10B981;
          --warning-amber: #F59E0B;
          --error-red: #EF4444;
          --gray-50: #F9FAFB;
          --gray-100: #F3F4F6;
          --gray-200: #E5E7EB;
          --gray-300: #D1D5DB;
          --gray-400: #9CA3AF;
          --gray-600: #4B5563;
          --gray-700: #374151;
          --gray-900: #111827;
          
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--gray-900);
        }

        /* Top Header */
        .top-header {
          background: white;
          border-bottom: 1px solid var(--gray-200);
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-logo {
          font-size: 40px;
          color: var(--primary-blue);
        }

        .header-title h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .header-title p {
          font-size: 14px;
          color: var(--gray-600);
          margin: 0;
          opacity: 0.9;
        }

        .header-right {
          flex-shrink: 0;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--gray-700);
          background: var(--gray-50);
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid var(--gray-200);
        }

        .status-icon {
          color: var(--success-green);
          font-size: 16px;
        }

        .save-time {
          margin-left: 8px;
          font-size: 13px;
          color: var(--gray-500);
          font-style: italic;
        }

        .progress-indicator {
          text-align: center;
          min-width: 140px;
        }

        .progress-label {
          font-size: 12px;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .progress-value {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(90deg, var(--secondary-blue), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 6px;
          background: var(--gray-200);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s ease;
        }

        /* Main Layout */
        .content-wrapper {
          display: flex;
          min-height: calc(100vh - 180px);
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid var(--gray-200);
          display: flex;
          flex-direction: column;
          padding: 24px 0;
        }

        .step-list {
          flex: 1;
          padding: 0 16px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          margin-bottom: 8px;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .step-item:hover:not(.active) {
          background: var(--gray-50);
          transform: translateX(4px);
          cursor: pointer;
        }

        .step-item.active {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border-left: 4px solid var(--secondary-blue);
        }

        .step-item.completed {
          opacity: 0.8;
        }

        .step-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }

        .step-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .step-name {
          font-weight: 600;
          font-size: 15px;
          color: var(--gray-900);
        }

        .step-desc {
          font-size: 12px;
          color: var(--gray-700);
          margin-top: 2px;
        }

        .step-check {
          color: var(--success-green);
          font-size: 16px;
        }

        .step-indicator {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--secondary-blue);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .sidebar-info {
          padding: 24px 16px 0;
          border-top: 1px solid var(--gray-200);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--gray-50);
          border-radius: 12px;
          border: 1px solid var(--gray-200);
        }

        .info-icon {
          color: var(--secondary-blue);
          font-size: 18px;
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
        }

        .info-title {
          font-weight: 600;
          font-size: 13px;
          color: var(--gray-900);
          margin-bottom: 2px;
        }

        .info-desc {
          font-size: 12px;
          color: var(--gray-600);
        }

        /* Content Area */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--gray-50);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* Form Section */
        .form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .form-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
          padding: 32px 32px 0;
        }

        .section-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--secondary-blue), var(--accent-purple));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
        }

        .section-title h2 {
          font-size: 28px;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 8px;
        }

        .section-title p {
          font-size: 16px;
          color: var(--gray-700);
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .form-card {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: var(--secondary-blue);
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 12px;
        }

        .label-icon {
          color: var(--secondary-blue);
          font-size: 16px;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--gray-300);
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--secondary-blue);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-hint {
          font-size: 12px;
          color: var(--gray-500);
          margin-top: 8px;
          font-style: italic;
        }

        .input-group {
          display: flex;
          align-items: center;
        }

        .input-suffix {
          margin-left: -60px;
          color: var(--gray-500);
          font-size: 14px;
        }

        .gender-selector {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .gender-option {
          padding: 12px;
          border: 1px solid var(--gray-300);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          color: var(--gray-700);
        }

        .gender-option:hover {
          border-color: var(--secondary-blue);
          color: var(--secondary-blue);
        }

        .gender-option.selected {
          background: var(--secondary-blue);
          color: white;
          border-color: var(--secondary-blue);
        }

        /* Assessment Details */
        .assessment-details {
          background: var(--gray-50);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--gray-200);
          margin-bottom: 32px;
        }

        .details-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding: 0;
        }

        .details-icon {
          color: var(--secondary-blue);
          font-size: 20px;
        }

        .details-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: var(--gray-900);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-label {
          font-size: 14px;
          color: var(--gray-600);
          font-weight: 500;
        }

        .date-input-wrapper {
          position: relative;
        }

        .date-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
          pointer-events: none;
        }

        .date-input {
          padding: 12px 16px 12px 40px;
          border: 1px solid var(--gray-300);
          border-radius: 10px;
          font-size: 14px;
          width: 100%;
        }

        .location-status, .save-status {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
        }

        .location-status.success {
          background: #D1FAE5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .location-status.error {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .location-status.loading {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
        }

        .save-status {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #DBEAFE;
        }

        /* Part Header */
        .part-header {
          padding: 32px;
          color: white;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-shrink: 0;
        }

        .part-icon {
          font-size: 40px;
          opacity: 0.9;
        }

        .part-title h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
        }

        .part-title p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }

        .part-score {
          margin-left: auto;
          text-align: center;
          background: rgba(255, 255, 255, 0.2);
          padding: 16px 24px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .score-label {
          display: block;
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .score-value {
          display: block;
          font-size: 32px;
          font-weight: 800;
        }

        /* BOTTOM NAVIGATION - ENHANCED WITH MARGINS */
        .bottom-navigation {
          padding: 28px 32px;
          background: white;
          border-top: 1px solid var(--gray-200);
          margin-top: auto;
          position: sticky;
          bottom: 0;
          z-index: 10;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .nav-buttons-wrapper {
          background: var(--gray-50);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--gray-200);
        }

        .nav-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .button-group {
          flex: 1;
          display: flex;
        }

        .button-group.left {
          justify-content: flex-start;
        }

        .button-group.right {
          justify-content: flex-end;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
          justify-content: center;
          margin: 0 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .nav-button.prev {
          background: var(--gray-100);
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }

        .nav-button.prev:hover {
          background: var(--gray-200);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }

        .nav-button.next {
          background: linear-gradient(90deg, var(--secondary-blue), var(--accent-purple));
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.25);
        }

        .nav-button.next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
        }

        .nav-button.next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .nav-button.submit {
          background: linear-gradient(90deg, var(--success-green), #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);
        }

        .nav-button.submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
        }

        .nav-button.submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        /* Footer */
        .footer {
          height: 60px;
          background: white;
          border-top: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          padding: 0 32px;
          font-size: 13px;
          color: var(--gray-600);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .footer-left, .footer-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-icon {
          font-size: 14px;
          color: var(--gray-500);
        }

        .footer-right .version {
          background: var(--gray-100);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: var(--gray-700);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .top-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .header-status {
            justify-content: center;
          }
          
          .nav-container {
            max-width: 100%;
          }
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--gray-200);
          }
          
          .step-list {
            display: flex;
            overflow-x: auto;
            padding: 16px;
          }
          
          .step-item {
            flex-direction: column;
            text-align: center;
            min-width: 120px;
          }
          
          .step-content {
            align-items: center;
          }
        }

        @media (max-width: 768px) {
          .top-header {
            padding: 20px;
          }
          
          .main-content {
            padding: 20px;
          }
          
          .form-content {
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .bottom-navigation {
            padding: 20px;
          }
          
          .nav-buttons-wrapper {
            padding: 16px;
          }
          
          .nav-buttons {
            flex-direction: column;
            gap: 16px;
          }
          
          .button-group {
            width: 100%;
            justify-content: center !important;
          }
          
          .nav-button {
            width: 100%;
            min-width: auto;
            margin: 0;
            padding: 16px 28px;
          }
          
          .footer {
            padding: 0 20px;
            flex-direction: column;
            height: auto;
            gap: 12px;
            padding: 16px;
            text-align: center;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .header-title h1 {
            font-size: 20px;
          }
          
          .form-card {
            padding: 20px;
          }
          
          .section-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          
          .nav-button {
            padding: 14px 24px;
            font-size: 15px;
          }
          
          .part-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
            padding: 24px;
          }
          
          .part-score {
            margin-left: 0;
            margin-top: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default AssessmentForm;