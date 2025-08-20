// server/routes/userRoutes.js অথবা authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ রেজিস্ট্রেশন API
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password // ✅ Password hashing middleware MongoDB model এ থাকতে হবে
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;