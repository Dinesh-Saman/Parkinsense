// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/spiral', require('./routes/spiralRoutes'));

// Health Check
app.get('/', (req, res) => {
  res.send('ParkinSense Backend Running – Sri Lanka PD Care');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});