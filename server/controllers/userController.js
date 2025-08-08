const User = require('../models/User');
const Log = require('../models/Log');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Update User Role',
      details: `User ${req.user.firstName} ${req.user.lastName} updated role of ${user.firstName} ${user.lastName} to ${role}`
    });
    
    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    // Delete user
    await User.findByIdAndDelete(req.params.id);
    
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Delete User',
      details: `User ${req.user.firstName} ${req.user.lastName} deleted user ${user.firstName} ${user.lastName}`
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
