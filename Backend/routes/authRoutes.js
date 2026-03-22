const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'parkinsense_secret_key';
const JWT_EXPIRES = '7d';

// Helper: validate email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};

// Helper: generate token
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// Configure nodemailer (Use your host and credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// ──────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, age, gender, specialization, slmcNumber } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      const roleText = existing.role === 'doctor' ? 'as a Doctor' : 'as a Patient';
      return res.status(409).json({ message: `This email is already registered ${roleText}.` });
    }

    const user = new User({ name, email, password, role, age, gender, specialization, slmcNumber });
    await user.save();

    res.status(201).json({ message: 'Account created successfully. Please log in.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        specialization: user.specialization,
        slmcNumber: user.slmcNumber || user.license,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/social-login (Google/Mock)
// ──────────────────────────────────────────────
router.post('/social-login', async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    console.log('--- SOCIAL LOGIN ATTEMPT ---');
    console.log('Email received:', email);
    
    if (!email) {
      console.log('Error: Email is missing from request');
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Database Result: User NOT found in system.');
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    console.log('Database Result: User found! ID:', user._id);
    const token = generateToken(user);
    console.log('Social login successful for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        specialization: user.specialization,
        slmcNumber: user.slmcNumber || user.license,
      }
    });
  } catch (err) {
    console.error('CRITICAL: Social login error:', err);
    res.status(500).json({ message: 'Server error during social login.' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/forgot-password
// ──────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Frontend URL for resetting password
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'ParkinSense Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
          `${resetURL}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'A password reset link has been sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending reset email. Please try again later.' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/reset-password/:token
// ──────────────────────────────────────────────
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Update password
    user.password = password; // pre-save hook will hash this
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password. Please try again later.' });
  }
});

const auth = require('../middleware/authMiddleware');

// PATCH /api/auth/profile
// ──────────────────────────────────────────────
router.patch('/profile', auth, async (req, res) => {
  try {
    const { name, age, gender, specialization, slmcNumber } = req.body;
    const userId = req.user.id;

    // Validate name
    if (name !== undefined && (name === null || name.trim() === '')) {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Role specific validation
    if (user.role === 'patient') {
      if (age !== undefined && (!age || isNaN(age) || age <= 0)) {
        return res.status(400).json({ message: 'Please provide a valid age.' });
      }
    }

    if (user.role === 'doctor') {
      if (slmcNumber !== undefined && (slmcNumber === null || slmcNumber.trim() === '')) {
        return res.status(400).json({ message: 'SLMC Number is required for Doctors.' });
      }
      if (specialization !== undefined && (specialization === null || specialization.trim() === '')) {
        return res.status(400).json({ message: 'Specialization is required for Doctors.' });
      }
    }

    // Update fields if provided
    if (name) user.name = name.trim();
    if (age)  user.age  = age;
    if (gender) user.gender = gender;
    
    // Role specific updates
    if (user.role === 'doctor') {
      if (specialization) user.specialization = specialization;
      if (slmcNumber)     user.slmcNumber     = slmcNumber;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        specialization: user.specialization,
        slmcNumber: user.slmcNumber || user.license,
      }
    });

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
});

module.exports = router;

