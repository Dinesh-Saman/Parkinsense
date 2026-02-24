// backend/controllers/voiceController.js
// (or api/controllers/voiceController.js if you restructured folders)

const axios = require('axios');
const FormData = require('form-data');

exports.analyzeVoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const { buffer, originalname, mimetype } = req.file;

    // Create FormData and append the audio buffer directly
    const form = new FormData();
    form.append('audio', buffer, {
      filename: originalname,       // Gives the Python ML endpoint a proper file name
      contentType: mimetype,        // Tells server it's audio (wav, mp3, webm, etc.)
    });

    // Send to your Python ML voice prediction endpoint
    // → Change this URL when you deploy (e.g. to your real server or cloud endpoint)
    const response = await axios.post('http://localhost:5001/predict_voice', form, {
      headers: {
        ...form.getHeaders(),       // Correct multipart boundary & content-type
      },
      maxContentLength: Infinity,   // Allow larger audio files if needed
      maxBodyLength: Infinity,
    });

    const { prediction, confidence } = response.data;

    // Format response consistently with spiral controller
    res.json({
      hasParkinson: prediction === "Parkinson",
      confidence: confidence + "%",
      message: prediction === "Parkinson"
        ? "Voice indicates possible Parkinson's disease"
        : "Voice appears normal"
    });

  } catch (error) {
    console.error("Voice analysis error:", error.message);
    if (error.response) {
      console.error("ML voice endpoint response:", error.response.data);
    }
    res.status(500).json({
      error: "Failed to analyze voice recording",
      details: error.message
    });
  }
};