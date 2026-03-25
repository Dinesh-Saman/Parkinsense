const express = require('express');
const multer = require('multer');
const voiceController = require('../controllers/voiceController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('audio'), voiceController.analyzeVoice);

module.exports = router;