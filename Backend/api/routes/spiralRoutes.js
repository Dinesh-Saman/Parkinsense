const express = require('express');
const multer = require('multer');
const spiralController = require('../../controllers/spiralController');  // Adjust path if needed

const router = express.Router();

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // e.g., 10MB max – adjust as needed
  fileFilter: (req, file, cb) => {
    // Optional: restrict to images (spiral drawings?)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/analyze', upload.single('image'), spiralController.analyzeSpiral);

module.exports = router;