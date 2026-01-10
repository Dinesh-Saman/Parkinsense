// backend/controllers/recommendationController.js
const Doctor = require('../models/Doctor');
const Assessment = require('../models/Assessment');

const haversineDistance = (coord1, coord2) => {
  const toRad = (x) => x * Math.PI / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLng = toRad(coord2[0] - coord1[0]);
  const lat1 = toRad(coord1[1]);
  const lat2 = toRad(coord2[1]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const stageMatch = (services, stage) => {
  if (!services) return false;
  if (stage.includes('Severe') && services.includes('DBS')) return true;
  if (stage.includes('Moderate') && (services.includes('Botox') || services.includes('Physio'))) return true;
  if (stage.includes('Mild')) return true;
  return false;
};

exports.getRecommendations = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    const patientCoords = assessment.location.coordinates; // [lng, lat]
    const patientStage = assessment.predictedStage;
    const maxDistance = 100; // km

    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: patientCoords },
          $maxDistance: maxDistance * 1000 // meters
        }
      }
    });

    const scored = doctors.map(doc => {
      const distance = haversineDistance(patientCoords, doc.location.coordinates);
      let score = 0;

      // 30% Location
      score += (1 - distance / maxDistance) * 0.3;

      // 25% PD Expertise
      score += (doc.specialty.includes('PD') ? 1 : 0) * 0.25;

      // 20% Stage Match
      score += (stageMatch(doc.services, patientStage) ? 1 : 0) * 0.2;

      // 15% Cost (Low > Medium > High)
      const costScore = doc.costLevel === 'Low' ? 1 : doc.costLevel === 'Medium' ? 0.7 : 0.4;
      score += costScore * 0.15;

      // 10% Rating
      score += (doc.rating / 5) * 0.1;

      return { ...doc.toObject(), distance: Math.round(distance), score: Number(score.toFixed(3)) };
    });

    const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5);

    res.json({ recommendations: top5, patientStage });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};