// backend/controllers/spiralController.js  (or api/controllers/ if you moved it)
const axios = require('axios');
const FormData = require('form-data');

exports.analyzeSpiral = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { buffer, originalname, mimetype } = req.file;

    // Create FormData and append the buffer directly (no fs needed)
    const form = new FormData();
    form.append('image', buffer, {
      filename: originalname,       // Required: gives the remote endpoint a file name
      contentType: mimetype,        // Helps the remote server know it's an image
    });

    // Send to your ML prediction endpoint
    // Change URL to your actual deployed ML service (see recommendations below)
    const response = await axios.post('http://localhost:5001/predict', form, {
      headers: {
        ...form.getHeaders(),       // Includes correct multipart boundary
      },
      maxContentLength: Infinity,   // Optional: allow large images
      maxBodyLength: Infinity,
    });

    const { prediction, confidence } = response.data;

    res.json({
      hasParkinson: prediction === "Parkinson",
      confidence: (confidence * 100).toFixed(2) + "%",
      message: prediction === "Parkinson"
        ? "Spiral indicates possible Parkinson's disease"
        : "Spiral appears normal"
    });

  } catch (error) {
    console.error("Spiral analysis error:", error.message);
    if (error.response) {
      console.error("ML endpoint response:", error.response.data);
    }
    res.status(500).json({ 
      error: "Failed to analyze spiral drawing",
      details: error.message 
    });
  }
};