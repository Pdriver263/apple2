// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// রেজিস্ট্রেশন রাউট
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields'
      });
    }

    console.log('Registration attempt:', { name, email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: 'temp-id',
        name: name,
        email: email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// লগিন রাউট
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    console.log('Login attempt:', { email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'temp-id',
        name: 'Test User',
        email: email
      },
      token: 'temp-token'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;