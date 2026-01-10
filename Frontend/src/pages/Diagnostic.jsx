// src/pages/Diagnostic.js
import React from "react";
import AssessmentForm from "../components/AssessmentForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecommendationPage from "../components/RecommendationPage";

const Diagnostic = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssessmentForm />} />
        <Route path="/recommendations/:id" element={<RecommendationPage />} />
      </Routes>
    </Router>
  );
};

export default Diagnostic;