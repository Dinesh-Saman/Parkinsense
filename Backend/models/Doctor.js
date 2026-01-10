// backend/models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospital: { type: String, required: true },
  specialty: { type: [String], required: true }, // e.g., ['PD', 'Movement Disorders']
  services: { type: [String] }, // e.g., ['DBS', 'Botox', 'Physio']
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: { type: String, required: true },
  phone: { type: String },
  costLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  rating: { type: Number, min: 0, max: 5, default: 4.0 },
  languages: { type: [String], default: ['Sinhala', 'English'] }
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);