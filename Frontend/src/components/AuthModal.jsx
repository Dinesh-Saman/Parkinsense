import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaBrain, FaEye, FaEyeSlash, FaUser, FaUserMd } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

const API = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [authView, setAuthView] = useState("login"); // "login", "signup", "forgotPassword"
  const [role, setRole] = useState("patient");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Helper: validate email
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const resetFormData = () => {
    setEmail("");
    setPassword("");
    setName("");
    setSpecialization("");
    setSlmcNumber("");
    setAge("");
    setGender("");
    setShowPassword(false);
    setKeepLoggedIn(false);
    setRole("patient");
    setError("");
    setSuccessMsg("");
  };

  // Body Scroll Lock & Reset Form on Open
  useEffect(() => {
    if (isAuthModalOpen) {
      resetFormData();
      setAuthView("login");
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
  }, [isAuthModalOpen]);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [slmcNumber, setSlmcNumber] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);


  // Google Sign In (Logic: checks if user exists, else redirects to signup)
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        const googleEmail = (userInfo.email || "").toLowerCase();
        const googleName = userInfo.name || "";

        // Check if user exists on our backend
        console.log('Sending social-login request for:', googleEmail);
        const socialRes = await fetch(`${API}/auth/social-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: googleEmail }),
        });

        console.log('Social login response status:', socialRes.status);
        if (socialRes.ok) {
          // USER EXISTS: Log them in directly
          const data = await socialRes.json();
          console.log('User found! Logging in directly...');
          setLoading(false);
          closeAuthModal();
          login(data.user, data.token, true); // Keep them logged in by default with google
          return;
        }

        // USER DOES NOT EXIST or 404: Redirect to signup with pre-filled info
        console.log('Social login failed (404), redirecting to signup view...');
        setLoading(false);
        setName(googleName);
        setEmail(googleEmail);
        setAuthView("signup");
        setSuccessMsg("Google account linked! Please choose your role and complete registration.");

      } catch (err) {
        setLoading(false);
        console.error("Failed to handle google sign-in", err);
        setError("Google sign-in failed. Please try again.");
      }
    },
    onError: () => setError("Google sign-in failed. Please try again."),
  });

  if (!isAuthModalOpen) return null;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Failed to send reset link.");
      } else {
        setSuccessMsg(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setLoading(true);

    try {
      if (authView === "login") {
        // ── SIGN IN ──────────────────────────────────────
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          setLoading(false);
          setError(data.message || "Login failed.");
          return;
        }
        
        // Success
        setLoading(false);
        closeAuthModal();
        login(data.user, data.token, keepLoggedIn);
        return;

      } else if (authView === "signup") {
        // ── SIGN UP ───────────────────────────────────────
        const body = { name, email, password, role };
        if (role === "patient") { body.age = age; body.gender = gender; }
        if (role === "doctor")  { body.specialization = specialization; body.slmcNumber = slmcNumber; }

        const res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        
        if (!res.ok) {
          setLoading(false);
          setError(data.message || "Registration failed.");
          return;
        }

        setLoading(false);
        setSuccessMsg("Account created! Please sign in.");
        resetFormData();
        setAuthView("login"); // switch to Sign In view
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please check your connection.");
      console.error(err);
    }
  };

  const toggleMode = () => {
    resetFormData();
    setAuthView(authView === "login" ? "signup" : "login");
  };



  return (
    <div className="ps-auth-overlay">
      <div className="ps-auth-container">
        
        {/* Left Side: Form Area (Blue) */}
        <div className="ps-auth-left">
          
          <div className="ps-brand-header">
            <div className="ps-brand">
              <FaBrain size={24} />
              <span>ParkinSense</span>
            </div>
            {/* Mobile Close Button */}
            <button className="ps-close-mobile" onClick={closeAuthModal}>
              <FaTimes size={20} />
            </button>
          </div>

          <h1 className="ps-title">
            {authView === "forgotPassword" ? "Reset Password" : authView === "login" ? "Sign In" : "Sign Up"}
          </h1>

          {/* Registration Role Toggle */}
          {authView === "signup" && (
            <div className="ps-role-tabs">
               <button 
                  type="button" 
                  className={`ps-role-btn ${role === 'patient' ? 'active-role' : ''}`}
                  onClick={() => setRole('patient')}
               >
                 <FaUser /> Patient
               </button>
               <button 
                  type="button" 
                  className={`ps-role-btn ${role === 'doctor' ? 'active-role' : ''}`}
                  onClick={() => setRole('doctor')}
               >
                 <FaUserMd /> Doctor
               </button>
            </div>
          )}

          {/* Google Mock */}
          {authView === "login" && (
            <>
              <button type="button" className="ps-google-btn" onClick={handleGoogleSignIn}>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

              <div className="ps-divider">
                <span className="ps-divider-line"></span>
                <span className="ps-divider-text">Or Login with Email</span>
                <span className="ps-divider-line"></span>
              </div>
            </>
          )}

          <form className="ps-form" onSubmit={authView === "forgotPassword" ? handleForgotPassword : handleSubmit}>
            
            {authView === "forgotPassword" ? (
              <div className="ps-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : authView === "login" ? (
              <div className="ps-input-group">
                <label>Username / Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Type your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div className="ps-form-row">
                <div className="ps-input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="ps-input-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Type your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {authView !== "forgotPassword" && (
              <div className="ps-input-group">
                <label>Password</label>
                <div className="ps-password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="ps-eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {/* Extra Patient Fields */}
            {authView === "signup" && role === "patient" && (
              <div className="ps-form-row">
                <div className="ps-input-group">
                  <label>Age</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 55"
                    min="1"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="ps-input-group">
                  <label>Gender</label>
                  <select 
                    required 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Extra Doctor Fields on Single Row */}
            {authView === "signup" && role === "doctor" && (
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
                    placeholder="e.g. 123456"
                    value={slmcNumber}
                    onChange={(e) => setSlmcNumber(e.target.value)}
                  />
                </div>
              </div>
            )}

            {authView === "login" && (
              <div className="ps-form-actions">
                <label className="ps-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  />
                  <span>Keep me logged in</span>
                </label>
                <button 
                  type="button" 
                  className="ps-forgot-link"
                  onClick={() => setAuthView("forgotPassword")}
                >
                  Forget your password?
                </button>
              </div>
            )}

            {/* Error / Success banners (Fixed height to prevent layout shift) */}
            <div className="ps-alert-wrapper">
              {error      && <div className="ps-alert ps-alert-error">{error}</div>}
              {successMsg && <div className="ps-alert ps-alert-success">{successMsg}</div>}
            </div>

            <button type="submit" className="ps-submit-btn" disabled={loading}>
              {loading
                ? "Please wait…"
                : authView === "forgotPassword"
                  ? "Send Reset Link"
                  : authView === "login"
                    ? "Login"
                    : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
            </button>
          </form>

          <div className="ps-toggle-prompt">
            {authView === "forgotPassword" ? (
              <button onClick={() => setAuthView("login")} className="ps-toggle-btn">
                Back to Sign in
              </button>
            ) : (
              <>
                {authView === "login" ? "Haven't sign up yet?" : "Already have an account?"} 
                <button onClick={toggleMode} className="ps-toggle-btn">
                  {authView === "login" ? "Sign up" : "Sign in"}
                </button>
              </>
            )}
          </div>

        </div>

        {/* Right Side: Illustration Area (White) */}
        {authView !== "forgotPassword" && (
          <div className="ps-auth-right">
            <button className="ps-close-main" onClick={closeAuthModal}>
              <FaTimes />
            </button>
            
            <div className="ps-illustration-wrapper">
               {/* Using the generated/provided illustration */}
               <img 
                 src={authView === "login" ? 
                   "https://palmmedicalcenters.com/wp-content/uploads/2025/09/A-senior-female-Patient-with-a-geriatric-doctor-in-a-medical-office.jpg" : 
                   "https://vidhilegalpolicy.in/wp-content/uploads/2023/04/iStock-1418999473.jpg"
                 } 
                 alt={authView === "login" ? "Medical professional login illustration" : "Sign up illustration"} 
                 className="ps-main-image" 
               />
            </div>
          </div>
        )}

        {/* If forgotPassword, show Close button on the left area since right is hidden */}
        {authView === "forgotPassword" && (
          <button 
            className="ps-close-main" 
            onClick={closeAuthModal} 
            style={{ position: 'absolute', top: '20px', right: '20px', color: 'white' }}
          >
            <FaTimes />
          </button>
        )}

      </div>

      <style>{`
        /* Reset and Variables */
        :root {
          --ps-blue: #4f46e5;
          --ps-blue-hover: #4338ca;
          --ps-bg: #4057ff; /* the intense blue from the screenshot */
          --ps-text: #ffffff;
        }

        .ps-auth-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          backdrop-filter: blur(4px);
          animation: ps-fade-in 0.3s ease forwards;
        }

        .ps-auth-container {
          display: flex;
          width: 100%;
          max-width: ${authView === "forgotPassword" ? "450px" : "900px"};
          min-height: 420px;
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          position: relative;
        }

        /* LEFT SIDE */
        .ps-auth-left {
          flex: 1;
          background-color: var(--ps-bg);
          padding: 25px 40px;
          color: white;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          justify-content: center;
        }

        .ps-brand-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .ps-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .ps-close-mobile {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .ps-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -0.5px;
        }

        /* Google Button */
        .ps-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          background-color: white;
          color: #333;
          border: none;
          padding: 10px;
          border-radius: 999px; /* Pill shape */
          font-weight: 400;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .ps-google-btn:hover {
          background-color: #f1f5f9;
        }

        .google-icon {
          width: 20px;
          height: 20px;
        }

        /* Divider */
        .ps-divider {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 15px 0;
          opacity: 0.9;
        }
        .ps-divider-line {
          height: 1px;
          flex: 1;
          background-color: rgba(255, 255, 255, 0.4);
        }
        .ps-divider-text {
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* Forms */
        .ps-form {
          display: flex;
          flex-direction: column;
          gap: 8px; /* Tighter layout to compensate for alert wrapper */
        }

        .ps-input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .ps-input-group input,
        .ps-input-group select {
          width: 100%;
          padding: 10px 16px;
          border: none;
          border-radius: 999px; /* Pill shape */
          font-size: 0.95rem;
          color: #333;
          outline: none;
          box-sizing: border-box;
          background-color: white;
        }

        .ps-input-group input::placeholder {
          color: #a0aec0;
        }

        .ps-password-wrapper {
          position: relative;
        }

        .ps-eye-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .ps-eye-btn:hover {
          color: #4a5568;
        }

        .ps-form-row {
          display: flex;
          gap: 15px;
        }
        .ps-form-row .ps-input-group {
          flex: 1;
        }

        /* Actions: Checkbox & Forget Link */
        .ps-form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 4px;
        }

        .ps-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .ps-checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: #fff;
          cursor: pointer;
        }

        .ps-forgot-link {
          background: none;
          border: none;
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }

        .ps-forgot-link:hover {
          text-decoration: underline;
        }

        /* Submit Button */
        .ps-submit-btn {
          width: 100%;
          padding: 12px;
          background-color: white;
          color: var(--ps-bg);
          border: none;
          border-radius: 999px;
          font-size: 1.05rem;
          font-weight: 800;
          margin-top: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .ps-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .ps-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .ps-alert-wrapper {
          height: 42px; /* Reserved space for alerts */
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        /* Alert banners */
        .ps-alert {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          text-align: center;
          box-sizing: border-box;
          animation: ps-fade-in-alert 0.25s ease;
        }

        @keyframes ps-fade-in-alert {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ps-alert-error {
          background-color: rgba(255, 80, 80, 0.2);
          border: 1px solid rgba(255, 80, 80, 0.5);
          color: #ffe0e0;
        }
        .ps-alert-success {
          background-color: rgba(80, 255, 160, 0.15);
          border: 1px solid rgba(80, 255, 160, 0.4);
          color: #c6ffe0;
        }

        /* Toggle Prompt */
        .ps-toggle-prompt {
          text-align: center;
          margin-top: 15px;
          font-size: 0.9rem;
        }
        .ps-toggle-btn {
          background: none;
          border: none;
          color: white;
          font-weight: 800;
          cursor: pointer;
          font-size: 0.95rem;
          margin-left: 5px;
        }
        .ps-toggle-btn:hover {
          text-decoration: underline;
        }

        /* Registration Role Tabs */
        .ps-role-tabs {
          display: flex;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 4px;
          margin-bottom: 15px;
        }

        .ps-role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: none;
          border: none;
          color: white;
          padding: 10px;
          border-radius: 26px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .active-role {
          background-color: white;
          color: var(--ps-bg);
        }

        /* RIGHT SIDE */
        .ps-auth-right {
          flex: 1.1; /* slightly wider if space allows */
          background-color: #ffffff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          overflow: hidden;
        }

        .ps-close-main {
          position: absolute;
          top: 25px;
          right: 25px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 1.25rem;
          transition: color 0.2s;
        }

        .ps-close-main:hover {
          color: #4b5563;
        }

        .ps-illustration-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
        }

        .ps-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 70% center;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .ps-auth-container {
            flex-direction: column-reverse; /* put form at bottom or illustration at top */
            border-radius: 16px;
            max-height: 95vh;
            overflow: hidden;
          }
          
          .ps-auth-left {
            padding: 30px 20px;
            max-height: none;
          }

          .ps-auth-right {
            display: none; /* hide illustration on mobile for space */
          }
          .ps-close-mobile {
            display: flex;
          }
        }

        @keyframes ps-fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;

