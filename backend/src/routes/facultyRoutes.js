const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/role');
const facultyController = require('../controllers/facultyController');

router.get('/dashboard', 
  auth, 
  role(['faculty']), 
  facultyController.getDashboard
);

// Add other faculty routes here

module.exports = router;