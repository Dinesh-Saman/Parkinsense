// backend/routes/assessmentRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const assessmentController = require('../../controllers/assessmentController');

const router = express.Router();

/* ==============================================================
   POST /api/assessments
   Creates a new MDS-UPDRS assessment
   ============================================================== */
router.post(
  '/',
  [
    // Required fields
    body('patientName')
      .isString()
      .notEmpty()
      .withMessage('Patient name is required and must be a string'),

    body('patientId')
      .isString()
      .notEmpty()
      .withMessage('Patient ID is required and must be a string'),

    body('doctorName')
      .isString()
      .notEmpty()
      .withMessage('Doctor name is required and must be a string'),

    body('consent')
      .isBoolean()
      .custom((value) => value === true)
      .withMessage('You must agree to the consent form'),

    body('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),

    body('lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),

    // Optional parts — plain objects
    body('part1').optional().isObject(),
    body('part2').optional().isObject(),
    body('part3').optional().isObject(),
    body('part4').optional().isObject(),
  ],

  // Validation middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  },

  // Controller
  assessmentController.createAssessment
);

/* ==============================================================
   GET /api/assessments
   List all assessments
   ============================================================== */
router.get('/', assessmentController.getAssessments);

module.exports = router;