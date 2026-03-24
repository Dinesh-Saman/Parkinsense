const express = require('express');
const multer = require('multer');
const spiralController = require('../controllers/spiralController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('image'), spiralController.analyzeSpiral);

module.exports = router;