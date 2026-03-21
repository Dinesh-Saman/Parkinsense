// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AssessmentForm from "./components/MDS-UPDRS/AssessmentForm";
import RecommendationPage from "./components/Recommendation/RecommendationPage";
import Home from "./pages/Home";
import SpiralTestPage from "./pages/SpiralTestPage";
import VoiceTestPage from "./pages/VoiceTestPage";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, openAuthModal } = useAuth();
  
  if (!user) {
    // Optional: trigger modal here if they try to access directly
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
      <Navbar />
      <AuthModal />
      <div className="pt-16 min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
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