// backend/controllers/assessmentController.js
const Assessment = require('../models/Assessment');

// Predict PD stage based on total MDS-UPDRS score
const predictStage = (totalScore) => {
  if (totalScore <= 30) return 'Mild (HY 1-2)';
  if (totalScore <= 60) return 'Moderate (HY 3)';
  return 'Severe (HY 4-5)';
};

// Safely sum values in a plain object (e.g. { "1.1": 2, "1.2": 1 } → 3)
const sumObject = (obj) => {
  if (!obj || typeof obj !== 'object') return 0;
  return Object.values(obj).reduce((acc, val) => acc + Number(val || 0), 0);
};

// Calculate scores for all 4 parts
const calculateScores = (part1, part2, part3, part4) => {
  const part1Score = sumObject(part1);
  const part2Score = sumObject(part2);
  const part3Score = sumObject(part3);
  const part4Score = sumObject(part4);
  const totalScore = part1Score + part2Score + part3Score + part4Score;
  return { part1Score, part2Score, part3Score, part4Score, totalScore };
};

/* ==============================================================
   CREATE ASSESSMENT (POST)
   ============================================================== */
exports.createAssessment = async (req, res) => {
  try {
    const {
      patientName, patientId, doctorName, consent,
      part1, part2, part3, part4, lat, lng
    } = req.body;

    // Basic validation
    if (!patientName || !patientId || !doctorName || consent !== true || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const scores = calculateScores(part1, part2, part3, part4);
    const predictedStage = predictStage(scores.totalScore);

    const assessment = new Assessment({
      patientName,
      patientId,
      doctorName,
      consent,
      location: { type: 'Point', coordinates: [lng, lat] }, // MongoDB: [lng, lat]
      part1: part1 || {},
      part2: part2 || {},
      part3: part3 || {},
      part4: part4 || {},
      ...scores,
      predictedStage
    });

    const saved = await assessment.save();

    res.status(201).json({
      message: 'Assessment saved',
      data: {
        id: saved._id,
        ...scores,
        predictedStage,
        date: saved.date
      }
    });
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ==============================================================
   GET ALL ASSESSMENTS (GET)
   ============================================================== */
exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .sort({ date: -1 }) // Newest first
      .select('patientName patientId totalScore predictedStage date') // Only needed fields
      .lean(); // Faster, plain JS objects

    res.json(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};