import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaBrain, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-reset-page">
      <div className="ps-reset-card">
        <div className="ps-reset-header">
          <FaBrain className="ps-reset-logo" />
          <h1>ParkinSense</h1>
        </div>

        {success ? (
          <div className="ps-reset-success">
            <FaCheckCircle className="ps-success-icon" />
            <h2>Password Changed!</h2>
            <p>Your password has been reset successfully. Redirecting you to the home page...</p>
            <Link to="/" className="ps-back-link">Return Home</Link>
          </div>
        ) : (
          <>
            <h2>Set New Password</h2>
            <p className="ps-reset-subtitle">Enter your new password below.</p>

            <form onSubmit={handleSubmit} className="ps-reset-form">
              <div className="ps-input-group">
                <label>New Password</label>
                <div className="ps-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimal 6 characters"
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

              <div className="ps-input-group">
                <label>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="ps-reset-error">
                  <FaExclamationCircle /> {error}
                </div>
              )}

              <button type="submit" className="ps-reset-btn" disabled={loading}>
                {loading ? "Processing..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        .ps-reset-page {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          overflow-y: auto;
        }

        .ps-reset-card {
          width: 100%;
          max-width: 450px;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          text-align: center;
          position: relative;
        }

        .ps-reset-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
          color: #4f46e5;
        }

        .ps-reset-logo {
          font-size: 2.5rem;
        }

        .ps-reset-card h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .ps-reset-card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .ps-reset-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 30px;
        }

        .ps-reset-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .ps-input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #475569;
        }

        .ps-input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s;
        }

        .ps-input-group input:focus {
          border-color: #4f46e5;
          ring: 2px solid #4f46e5;
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
          color: #94a3b8;
          cursor: pointer;
        }

        .ps-reset-error {
          background-color: #fef2f2;
          border-left: 4px solid #ef4444;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ps-reset-btn {
          width: 100%;
          padding: 14px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 10px;
        }

        .ps-reset-btn:hover {
          background-color: #4338ca;
        }

        .ps-reset-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ps-reset-success {
          padding: 20px 0;
        }

        .ps-success-icon {
          font-size: 4rem;
          color: #10b981;
          margin-bottom: 20px;
        }

        .ps-back-link {
          display: inline-block;
          margin-top: 20px;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }

        .ps-back-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
