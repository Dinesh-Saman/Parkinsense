// backend/models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String, required: true },
  doctorName: { type: String, required: true },
  consent: { type: Boolean, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  // Change from Map → Object
  part1: { type: Object, default: {} },
  part2: { type: Object, default: {} },
  part3: { type: Object, default: {} },
  part4: { type: Object, default: {} },
  part1Score: Number,
  part2Score: Number,
  part3Score: Number,
  part4Score: Number,
  totalScore: Number,
  predictedStage: String,
  date: { type: Date, default: Date.now }
});

assessmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Assessment', assessmentSchema);