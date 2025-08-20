// server/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected!"))
.catch(err => console.log('MongoDB connection error:', err));

// ✅ শুধু existing routes import করুন
const paymentRoutes = require('./routes/paymentRoutes');
const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
// ✅ শুধু existing routes register করুন
app.use('/api/payments', paymentRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);

// ✅ auth-related routes সরাসরি app.js এ যোগ করুন
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields'
      });
    }

    console.log('Registration attempt:', { name, email });

    // এখানে আপনি আপনার User model ব্যবহার করে user create করতে পারেন
    // const newUser = new User({ name, email, password });
    // await newUser.save();

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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // এখানে আপনি authentication logic যোগ করুন
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

// WebSocket setup
const { setupWebSocket } = require('./websocket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}/ws`);
  console.log(`API endpoints available at: http://localhost:${PORT}/api`);
});