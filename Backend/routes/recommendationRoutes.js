// backend/routes/recommendationRoutes.js
const express = require('express');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

router.get('/:assessmentId', recommendationController.getRecommendations);

module.exports = router;