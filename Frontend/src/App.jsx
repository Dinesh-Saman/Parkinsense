// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AssessmentForm from "./components/MDS-UPDRS/AssessmentForm";
import RecommendationPage from "./components/Recommendation/RecommendationPage";
import Home from "./pages/Home";

// Helper component to handle scrolling to hash fragments
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};
import SpiralTestPage from "./pages/SpiralTestPage";
import VoiceTestPage from "./pages/VoiceTestPage";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ResetPassword from "./pages/ResetPassword";
import UnderstandingParkinsons from "./pages/blog-posts/UnderstandingParkinsons";
import EarlyDetection from "./pages/blog-posts/EarlyDetection";
import ScreeningTechniques from "./pages/blog-posts/ScreeningTechniques";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";
import EditProfileModal from "./components/EditProfileModal";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show nothing or a small spinner during hydration check
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <Router>
      <ScrollToHash />
      <Navbar />
      <AuthModal />
      <EditProfileModal />
      <div className="pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Diagnosis is Doctor ONLY */}
          <Route 
            path="/diagnostic" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AssessmentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations/:id" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <RecommendationPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Spiral and Voice Tests are for both Doctor and Patient */}
          <Route 
            path="/spiral-test" 
            element={
              <ProtectedRoute allowedRoles={['doctor', 'patient']}>
                <SpiralTestPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voice-analysis" 
            element={
              <ProtectedRoute allowedRoles={['doctor', 'patient']}>
                <VoiceTestPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/reset-password/:token" element={<><Home /><ResetPassword /></>} />
          
          {/* Blog/Info Pages */}
          <Route path="/blog/understanding-parkinsons" element={<UnderstandingParkinsons />} />
          <Route path="/blog/early-detection" element={<EarlyDetection />} />
          <Route path="/blog/screening-techniques" element={<ScreeningTechniques />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;