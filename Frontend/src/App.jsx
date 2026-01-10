// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AssessmentForm from "./components/MDS-UPDRS/AssessmentForm";
import RecommendationPage from "./components/Recommendation/RecommendationPage";
import Home from "./pages/Home";
import SpiralTestPage from "./pages/SpiralTestPage";   // ← NEW: Spiral Test Page

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnostic" element={<AssessmentForm />} />
          <Route path="/recommendations/:id" element={<RecommendationPage />} />
          
          {/* ← NEW ROUTE: Spiral Drawing Test */}
          <Route path="/spiral-test" element={<SpiralTestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;