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
  FaBars,
  FaTimes,
  FaHistory
} from "react-icons/fa";
import { GiHospitalCross } from "react-icons/gi";
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
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  // Prevent flash of step 0 — wait until localStorage is restored
  const [isRestored, setIsRestored] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load from localStorage – restore everything before rendering UI
  useEffect(() => {
    const saved = localStorage.getItem("updrs-form");
    if (saved) {
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

        // Restore the exact step user was on (e.g. Summary)
        setCurrentStep(data.currentStep || 0);
        setShowConsent(!data.consent);
        setLastSaved(data.lastSaved ? new Date(data.lastSaved).toLocaleTimeString() : null);
      } catch (err) {
        console.error("Failed to load saved form:", err);
      }
    }

    // Mark restoration complete – now safe to render the form
    setIsRestored(true);
  }, []);

  // Save to localStorage with timestamp
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

  // Get User Location
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
      if (isMobile) {
        setShowMobileMenu(false);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      if (isMobile) {
        setShowMobileMenu(false);
      }
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
      
      const res = await axios.post("https://parkinsensebackend-2pvupvarq-dineshs-projects-d4453a53.vercel.app/api/assessments", payload);
      const assessmentId = res.data.data.id;

      // Clear storage ONLY after successful submission
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
  const currentStepData = STEPS[currentStep] || {};

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
          
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          )}
          
          <div className="header-right">
            <div className="header-status">
              {!isMobile && (
                <div className="status-item">
                  <FaDatabase className="status-icon" />
                  <span>Auto-save: <strong>Active</strong></span>
                  {lastSaved && (
                    <span className="save-time">Last: {lastSaved}</span>
                  )}
                </div>
              )}
              <div className="progress-indicator">
                <div className="progress-label">Completion</div>
                <div className="progress-value">{completionPercentage}%</div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ background: `linear-gradient(90deg, ${currentStepData.color || "#3b82f6"}, #60a5fa)` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && showMobileMenu && (
          <div className="mobile-overlay" onClick={() => setShowMobileMenu(false)} />
        )}

        {/* Mobile Step Selector */}
        {isMobile && (
          <div className={`mobile-step-selector ${showMobileMenu ? 'open' : ''}`}>
            <div className="mobile-step-header">
              <h3>Assessment Steps</h3>
              <button className="mobile-close-btn" onClick={() => setShowMobileMenu(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="mobile-step-list">
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  className={`mobile-step-item ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep}
                >
                  <div className="mobile-step-icon" style={{ background: step.color }}>
                    {step.icon}
                  </div>
                  <div className="mobile-step-content">
                    <div className="mobile-step-name">{step.name}</div>
                    {step.description && (
                      <div className="mobile-step-desc">{step.description}</div>
                    )}
                  </div>
                  {index < currentStep && <FaCheckCircle className="mobile-step-check" />}
                  {index === currentStep && <div className="mobile-step-indicator"></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="content-wrapper">
          {/* Sidebar Navigation - Hidden on Mobile */}
          {!isMobile && (
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
          )}

          {/* Main Content Area – Only render after restoration */}
          <div className="content-area">
            {isRestored ? (
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

                {/* Mobile Current Step Indicator */}
                {isMobile && !showConsent && (
                  <div className="mobile-current-step">
                    <div className="mobile-step-header-info">
                      <div className="mobile-step-icon-indicator" style={{ background: STEPS[currentStep]?.color || "#3b82f6" }}>
                        {STEPS[currentStep]?.icon}
                      </div>
                      <div>
                        <h3>{STEPS[currentStep]?.name}</h3>
                        {STEPS[currentStep]?.description && (
                          <p>{STEPS[currentStep]?.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="mobile-step-progress">
                      Step {currentStep + 1} of {STEPS.length}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {/* Patient Information */}
                  {currentStep === 0 && !showConsent && (
                    <motion.div
                      key="patient-info"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mds-card form-section"
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

                      <div className="mds-content-area form-content">
                        <div className="mds-form-grid form-grid">
                          <div className="mds-form-group form-card">
                            <label className="mds-form-label form-label">
                              <FaUserInjured className="label-icon" />
                              Patient Full Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter patient's full name"
                              className="mds-form-input form-input"
                              value={formData.patientName}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, patientName: e.target.value }))
                              }
                            />
                            <div className="form-hint">Required field</div>
                          </div>

                          <div className="mds-form-group form-card">
                            <label className="mds-form-label form-label">
                              <FaIdCard className="label-icon" />
                              Patient ID *
                            </label>
                            <input
                              type="text"
                              placeholder="PD-YYYY-XXX"
                              className="mds-form-input form-input"
                              value={formData.patientId}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, patientId: e.target.value }))
                              }
                            />
                            <div className="form-hint">Format: PD-2024-001</div>
                          </div>

                          <div className="mds-form-group form-card">
                            <label className="mds-form-label form-label">
                              <FaUserMd className="label-icon" />
                              Physician Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter physician's name"
                              className="mds-form-input form-input"
                              value={formData.doctorName}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, doctorName: e.target.value }))
                              }
                            />
                            <div className="form-hint">Attending physician</div>
                          </div>

                          <div className="mds-form-group form-card">
                            <label className="mds-form-label form-label">
                              <FaHospital className="label-icon" />
                              Medical Facility
                            </label>
                            <input
                              type="text"
                              placeholder="Enter hospital/clinic name"
                              className="mds-form-input form-input"
                              value={formData.clinicName}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, clinicName: e.target.value }))
                              }
                            />
                          </div>

                          <div className="mds-form-group form-card">
                            <label className="mds-form-label form-label">
                              <span className="label-icon">#</span>
                              Age
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                placeholder="65"
                                min="0"
                                max="120"
                                className="mds-form-input form-input"
                                value={formData.patientAge}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, patientAge: e.target.value }))
                                }
                              />
                              <span className="input-suffix">years</span>
                            </div>
                            <div className="form-hint">Patient's current age</div>
                          </div>

                          <div className="mds-form-group form-card">
                            <label className="mds-form-label form-label">
                              <FaVenusMars className="label-icon" />
                              Gender
                            </label>
                            <div className="gender-selector">
                              {['male', 'female', 'other', 'prefer-not-to-say'].map(gender => (
                                <button
                                  key={gender}
                                  className={`gender-option mds-button-secondary ${formData.patientGender === gender ? 'selected' : ''}`}
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
                        <div className="mds-location-info assessment-details">
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

                      {/* Navigation Buttons */}
                      <div className="mds-navigation-footer bottom-navigation">
                        <div className="nav-container">
                          <div className="nav-buttons-wrapper">
                            <div className="mds-flex-between nav-buttons">
                              <div className="button-group left">
                                {currentStep > 0 && (
                                  <button className="mds-button mds-button-secondary nav-button prev" onClick={prevStep}>
                                    <FaChevronLeft />
                                    <span>Back</span>
                                  </button>
                                )}
                              </div>
                              <div className="button-group right">
                                <button 
                                  className="mds-button mds-button-primary nav-button next"
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
                      className="mds-card form-section"
                    >
                      {!isMobile && (
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
                              {formData[["part1", "part2", "part3", "part4"][currentStep - 1]]?.size || 0}
                              /{MDS_UPDRS_ITEMS[["part1", "part2", "part3", "part4"][currentStep - 1]]?.length || 0}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mds-content-area form-content">
                        <PartForm
                          part={["part1", "part2", "part3", "part4"][currentStep - 1]}
                          items={MDS_UPDRS_ITEMS[["part1", "part2", "part3", "part4"][currentStep - 1]]}
                          scores={formData[["part1", "part2", "part3", "part4"][currentStep - 1]]}
                          onUpdate={updateScore}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="mds-navigation-footer bottom-navigation">
                        <div className="nav-container">
                          <div className="nav-buttons-wrapper">
                            <div className="mds-flex-between nav-buttons">
                              <div className="button-group left">
                                <button className="mds-button mds-button-secondary nav-button prev" onClick={prevStep}>
                                  <FaChevronLeft />
                                  <span>Back</span>
                                </button>
                              </div>
                              <div className="button-group right">
                                <button 
                                  className="mds-button mds-button-primary nav-button next"
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
                      className="mds-card form-section"
                    >
                      <div className="mds-content-area form-content">
                        <Summary
                          formData={formData}
                          location={location}
                          loading={loading}
                          onPrev={prevStep}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="mds-navigation-footer bottom-navigation">
                        <div className="nav-container">
                          <div className="nav-buttons-wrapper">
                            <div className="mds-flex-between nav-buttons">
                              <div className="button-group left">
                                <button className="mds-button mds-button-secondary nav-button prev" onClick={prevStep}>
                                  <FaChevronLeft />
                                  <span>Back</span>
                                </button>
                              </div>
                              <div className="button-group right">
                                <button 
                                  className="mds-button mds-button-success nav-button submit"
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
            ) : (
              <div style={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: "1.2rem"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    border: "5px solid #e2e8f0",
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 1rem"
                  }}></div>
                  <p>Restoring your previous assessment...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mds-footer footer">
          <div className="footer-content">
            <div className="footer-left">
              <FaFileMedical className="footer-icon" />
              <span>© 2008 International Parkinson and Movement Disorder Society</span>
            </div>
            {!isMobile && (
              <>
                <div className="footer-center">
                  <TbChartArcs className="footer-icon" />
                  <span>MDS-UPDRS Version 2.0 • Clinical Assessment Tool</span>
                </div>
                <div className="footer-right">
                  <div className="version">v1.0.0</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentForm;