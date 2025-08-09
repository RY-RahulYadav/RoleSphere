const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logActivity = require('./middleware/logger');
require('dotenv').config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '1mb' })); // Restrict payload to 1MB maximum
app.use(cors());

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Protected routes with activity logging
app.use(logActivity);
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/logs', require('./routes/logs'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
