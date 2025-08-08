const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { auth, isAdmin } = require('../middleware/auth');

// Get all logs (admin only)
router.get('/', auth, isAdmin, logController.getAllLogs);

module.exports = router;
