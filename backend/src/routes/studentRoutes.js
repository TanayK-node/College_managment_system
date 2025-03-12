const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/role');
const studentController = require('../controllers/studentController');

router.get('/dashboard', 
  auth, 
  role(['student']), 
  studentController.getDashboard
);

// Add other student routes here

module.exports = router;