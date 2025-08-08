const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// All routes are protected and only accessible by admin
router.use(auth, isAdmin);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user role
router.put('/:id/role', userController.updateUserRole);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
