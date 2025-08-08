const Log = require('../models/Log');

// Get all logs (admin only)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .populate('user', 'firstName middleName lastName email role');
    
    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
