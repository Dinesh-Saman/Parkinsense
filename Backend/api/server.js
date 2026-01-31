const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ **MINIMAL CORS - This should work**
app.use(cors());

// OR more specific:
// app.use(cors({
//   origin: 'http://localhost:5173'
// }));

// Other middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect('mongodb+srv://Dinesh:Dinesh22307@cluster0.mz7ruhy.mongodb.net/')
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});