const Log = require('../models/Log');

const logActivity = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function (data) {
    // Only log if the request was successful
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      try {
        const action = `${req.method} ${req.originalUrl}`;
        
        // Create a log entry
        Log.create({
          user: req.user._id,
          action: action,
          details: `User ${req.user.name} performed ${action}`
        });
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    }
    
    originalSend.call(this, data);
    return this;
  };
  
  next();
};

module.exports = logActivity;
