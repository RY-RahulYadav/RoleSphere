const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// Middleware to authenticate token
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based middleware functions
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Access denied: Admin role required' 
  });
};

exports.isEditor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Access denied: Editor role required' 
  });
};

exports.isViewer = (req, res, next) => {
  // All authenticated users have at least viewer privileges
  if (req.user) {
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Access denied: Authentication required' 
  });
};
