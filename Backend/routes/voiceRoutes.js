const express = require('express');
const multer = require('multer');
const spiralController = require('../controllers/voiceController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('image'), voiceController.analyzeVoice);

module.exports = router;