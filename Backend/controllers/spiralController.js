// backend/controllers/spiralController.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.analyzeSpiral = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));

    const response = await axios.post('http://localhost:5001/predict', form, {
      headers: form.getHeaders(),
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

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
    res.status(500).json({ error: "Failed to analyze spiral drawing" });
  }
};